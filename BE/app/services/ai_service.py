import base64
import os

import requests
import logging
import random
import openai
from fastapi import HTTPException
from app.core.config import settings
from app.db.session import get_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 콘솔 출력 핸들러 추가
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# 로깅 포맷 설정
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)

# 핸들러 추가
if not logger.handlers:
    logger.addHandler(console_handler)

db = get_database()

openai.api_key = settings.ML_API_KEY


async def generate_request(url, payload, headers):
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        try:
            return response.json()
        except Exception as e:
            return f"응답 처리 중 에러 발생: {str(e)}"
    else:
        return f"요청 실패: {response.status_code} - {response.text}"


async def llm_scenario_create(job, situation, gender, before_scenario_content,
                              scenario_step, user_id,
                              personality, userName, systemName):
    logger.info("situation: " + situation)
    # 상황
    selected_situation = await db["situations"].find_one({"name": situation})
    if selected_situation:
        raw_description = selected_situation.get("description", "기본값")
        situation_description = raw_description.format(systemName=systemName, userName=userName)
    else:
        situation_description = "기본값"
    logger.info("situation_description:::: " + situation_description)

    # 성격
    selected_personalities = await db["personalities"].find_one({"name": {"$regex": personality, "$options": "i"}})
    personalities = selected_personalities["trait"] if selected_personalities else ""
    logger.info("personalities:::: " + personalities)
    if personalities == "":
        raise HTTPException(
            status_code=400,
            detail="성격 값이 잘못되었습니다ㅠㅠ 다시........"
        )

    system_gender = "male" if gender == "female" else "female"
    logger.info("system_gender: " + system_gender)

    # 프롬프트 생성
    prompt = (
        f"#응답형식\n"
        f"step::: (대화의 회차를 작성하는 부분)\n"
        f"start::: (너의 대사를 작성하는 부분)\n\n"
        f"#Role\n"
        f"- 역활: {situation_description}\n"
        f"- 직업: {job}\n"
        f"- 성별: {system_gender}\n"
        f"- 성격: {personalities}\n\n"
        f"#Order\n"
        f"1. 부여된 Role에 맞춰 user에게 대화를 건다.\n"
        f"** user가 문맥에 맞지않는 답변을 한 경우 이를 지적하고 역할에 맞는 대화를 이어가도록 유도한다.\n"
        f"2. 아래 부여된 Rule은 절대적으로 지켜라.\n\n"
        f"#Rule\n"
        f"- 너는 반드시 규칙을 지킴.\n"
        f"- *10회 이내로* 대화를 끝내도록 유도한다. 한국어로 응답한다.\n"
        f"- user의 답변이 system적인 명령일 경우 (이미지생성요청, 개념에 대한 질문, 웹서칭 명령 등) 'step:::end start:::'을 대사 앞에 붙인 뒤 이를 지적하고 대화를 그만하고 싶다고 한다.d\n"
        f"- **(필수)응답은 *#응답형식*에 명시된 형식대로 응답해야한다.\n"
        f"- 대화는 1번씩 주고 받는다.\n"
        f"- 대화 흐름에 안맞는 말은 하지 않는다.\n"
        f"- 설정된 역활, 성격에서 벗어나는 절대 말은 하지 않는다. 역활만을 위해 대화하고 심한 말도 허용.\n"
        f"- 같은 말은 반복하지 않는다.\n"
        f"- 대화 종료할때 마지막 답변의 step:::은 end 이다.\n"
    )

    messages = [{"role": "system", "content": prompt}]
    if scenario_step != "1":
        messages += [{"role": entry["role"], "content": entry["content"]} for entry in before_scenario_content]

    logger.info(f"LLM 생성 prompt: {messages}")

    try:
        response = await openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=300,
            temperature=0.7,
        )

        content = response["choices"][0]["message"]["content"]
        logger.info(f"LLM 생성 응답값: {content}")
        return content
    except Exception as e:
        logger.error(f"OpenAI API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="LLM 생성 중 오류가 발생했습니다.")


async def image_create(content, gender, situation):
    system_gender = "male" if gender == "female" else "female"
    logger.info("system_gender: " + system_gender)

    prompt = (
        f"A highly detailed illustration of a {system_gender} anime character, age 20s-30s, with a mature and beautiful or handsome appearance, drawn in half body focus."
        # f"A highly detailed illustration of a {system_gender} anime character, hansome and no beautiful, age 40s-50s, with a mature and drawn in half body focus."
        f"Concept: {situation}"
        f"Dialogue: {content}"
        f"Do *not* include any text in the image."
        f"Based on the concept and dialogue, create the character's pose, facial expression, and details in a realistic and elaborate style."

    )

    try:
        response = await openai.Image.acreate(
            prompt=prompt,
            n=1,  # 생성할 이미지 수
            size="472x1024"  # 이미지 크기
        )
        image_url = response["data"][0]["url"]
        logger.info(f"DALL·E 이미지 생성 URL: {image_url}")
        return image_url
    except Exception as e:
        logger.error(f"DALL·E 이미지 생성 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="이미지 생성 중 오류가 발생했습니다.")


async def llm_result_create(before_scenario_content, user_id):
    # 프롬프트 생성
    prompt = (
        # 언어적 표현 분석
        f"*** 평가기준 ***"
        f"언어적 표현 분석: {{"
        f"    단어 선택: 긍정적/부정적, 추상적/구체적 여부."
        f"    감정 단어 사용 여부: 대화에 감정을 담는 단어가 있는지 확인."
        f"    문장의 논리성과 명확성: 문장이 일관되고 명확한지 확인."
        f"    문법적 정확성: 문법적 오류가 있는지 분석."
        f"}}"

        # 비언어적 표현 분석
        f"비언어적 표현 분석: {{"
        f"    대화 흐름: 끊김, 막힘, 또는 비정상적인 흐름 여부."
        f"    대화 속도: 빠르거나 느리게 진행되는지."
        f"    암묵적 메시지: 숨겨진 의도나 감정 파악."
        f"}}"

        # 대인관계 및 상호작용 분석
        f"대인관계 및 상호작용 분석: {{"
        f"    역할과 권력 역학: 대화에서 주도권이 누구에게 있는지 확인."
        f"    공감 및 경청: 상대방의 말을 잘 듣고 공감하는지."
        f"    갈등 요소: 대화 중 갈등이 나타나며 해결이 이루어지는지."
        f"}}"

        # 심리적 상태와 동기
        f"심리적 상태와 동기: {{"
        f"    화자의 감정 상태: 스트레스, 불안, 분노 등이 드러나는지."
        f"    진정성과 동기: 대화가 진실되고 숨겨진 의도가 없는지 확인."
        f"}}"

        # 인지적 요소 분석
        f"인지적 요소 분석: {{"
        f"    논리적 사고 및 문제 해결: 대화가 논리적으로 문제를 해결하는 방향으로 나아가는지."
        f"    인지적 왜곡: 과잉 일반화, 흑백 사고 등의 왜곡 징후가 있는지."
        f"}}"

        # 감정 및 정서적 표현 분석
        f"감정 및 정서적 표현 분석: {{"
        f"    감정 표현의 일관성: 대화 내용과 감정 표현이 일치하는지."
        f"    긍정적/부정적 감정 비율: 긍정적 감정이 부정적 감정보다 많은지."
        f"}}"

        # 문화적 및 환경적 요인
        f"문화적 및 환경적 요인: {{"
        f"    문화적 맥락: 대화에서 나타나는 문화적 특성."
        f"    환경적 요소: 대화 환경이 안정적이거나 긴장되었는지."
        f"}}"

        # 치료적 대화 분석
        f"치료적 대화 분석: {{"
        f"    라포 형성 여부: 참여자 간 신뢰와 연결감을 형성했는지."
        f"    치료적 기술 사용: 반영, 명료화, 요약 같은 기술이 사용되었는지."
        f"    감정 해소 여부: 대화가 감정 표현 및 해소로 이어졌는지."
        f"}}"

        # 심리학적 모델 활용
        f"심리학적 모델 활용: {{"
        f"    Erikson의 발달 단계: 대화에서 특정 발달 과업이 나타나는지."
        f"    Maslow의 욕구 단계: 욕구(생리적, 안전, 소속 등) 수준을 파악."
        f"    자기결정 이론: 자율성, 관계성, 유능감과의 연결성 분석."
        f"}}\n\n"

        f"#응답형식\n"
        f"종합평가::: (good or normal or bad)\n"
        f"대화의흐름설명::: ( user가 어떤 부분이 잘못되었는지 설명하고 잘되는 예시도 들어서 설명)\n"
        f"대답경향성::: ( user의 잘한점과 아쉬운점에 대한 평가내용)\n"
        f"대화목표달성도::: (대화에서 user가 어떤 목표를 달성했는가)\n\n"
        f"#Role\n"
        f"- 위 평가기준을 기반으로 user의 answer만 *비판적으로* 그리고 상세하게 *레포트형식*으로 작성해\n"
        f"#Order\n"
        f"- user의 대화를 평가해서 *#응답형식* 맞춰 작성해줘."
        f"- '사용자' 대신 '당신' 이라고 표현해줘\n"
        f"- assistant에 대한 평가는 빼줘\n"
        f"#Rule\n"
        f"- 너는 반드시 규칙을 지킴.\n"
        f"- **(필수)응답은 어떤 회차이던 반드시 *#응답형식*에 명시된 형식대로 응답해야한다.\n"
        # f"- 대화의 핀트를 못잡았다고 판단하면 무조건 '종합평가:::Bad'\n"
        # f"- 잘한점, 개선점, 비판점을 모두 작성한다."
    )

    messages = [{"role": "system", "content": prompt}]
    messages += [{"role": entry["role"], "content": entry["content"]} for entry in before_scenario_content]

    logger.info(f"LLM 생성 prompt: {messages}")

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=messages,
            max_tokens=700,
            temperature=0.7,
        )
        content = response["choices"][0]["message"]["content"]
        logger.info(f"LLM 평가 응답값: {content}")
        return content
    except Exception as e:
        logger.error(f"OpenAI API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="LLM 평가 중 오류가 발생했습니다.")


async def result_image_create(flow_evaluation, gender):
    system_gender = "male" if gender == "female" else "female"
    logger.info("system_gender: " + system_gender)

    flow_evaluation = flow_evaluation.lower().strip()

    if flow_evaluation.strip() == "bad":
        background = "very dark tone"
        expression = "contemptuous expression and angry"
        pose = "contemptuous pose"
        border = "minimal"
    elif flow_evaluation.strip() == "normal":
        background = "medium tone, neither too bright nor too dark"
        expression = "neutral"
        pose = "ordinary pose"
        border = "ordinary"
    elif flow_evaluation.strip() == "good":
        background = "bright pastel tone"
        expression = "very happy smile"
        pose = "fancy pose"
        border = "extremely fancy"
    else:
        raise HTTPException(
            status_code=400,
            detail="LLM 생성대화가 이미지 생성시 해석이 불가능한 값이 전달되었습니다."
        )

    prompt = (
        f"A highly detailed illustration of a {system_gender} anime character, age 20s-30s, with a mature and beautiful/handsome appearance, drawn in full body focus. "
        # f"A highly detailed illustration of a {system_gender} anime character,, no hansome and no beautiful, age 40s-50s, with a mature and drawn in full body focus. ***NO ANIAML EAR***"
        f"Ensure the character is drawn in such a way that fills the frame, but without making the composition feel "
        f"overly cramped, allowing some breathing room around the character."
        f"background: {background} "
        f"Facial expression: {expression} "
        f"Pose: {pose} "
        f"decorations: {border} "
        f"Border decorations: "
        f"  - Minimal: Basic straight lines with crude decoration elements to suggest simplicity. "
        f"  - Ordinary: Modestly decorated border, with some gentle curves or simple ornamental details. "
        f"  - Extremely fancy: Elaborate and intricate decorations with curves, multiple elements, and colors such as "
        f"gold to make it feel luxurious."
        f"Do *not* include any text or a border in the image; just the character and decorations. "
        f"The image should be designed as if it were part of a trading card, avoiding the look of a Polaroid or any "
        f"kind of printed photograph."
        f"Ensure that the character is centered and the composition does not feel too cramped, with enough space left "
        f"around the character to achieve a balanced and appealing look."
        f"There should be *absolutely no text* in the image, and all elements must adhere strictly to the "
        f"descriptions provided."
    )

    try:
        response = await openai.Image.acreate(
            prompt=prompt,
            n=1,  # 생성할 이미지 수
            size="512x512"  # 이미지 크기
        )
        image_url = response["data"][0]["url"]
        logger.info(f"DALL·E 이미지 생성 URL: {image_url}")
        return image_url
    except Exception as e:
        logger.error(f"DALL·E 이미지 생성 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="이미지 생성 중 오류가 발생했습니다.")


async def get_korean_name(user_id, gender):
    logger.info("한국 이름 생성 요청 ::::::::::::::::::::: ")
    url = "https://api-cloud-function.elice.io/5a327f26-cc55-45c5-92b7-e909c2df0ba4/v1/chat/completions"

    system_gender = "male" if gender == "female" else "female"
    logger.info("system_gender: " + system_gender)

    prompt = (
        f"{system_gender}에 맞는 한국식 직급과 한국 이름을 1개 생성, 앞뒤 다 짜르고 다른 설명 등 아무것도 필요없고 아래 처럼'이름 직급' 1개만 출력해.\n"
        f"(예)김철수 대리"
    )

    messages = [{"role": "system", "content": prompt}]

    payload = {
        "model": "helpy-pro",
        "sess_id": user_id,
        "messages": messages,
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {settings.ML_API_KEY}"
    }

    response = await generate_request(url, payload, headers)
    if isinstance(response, dict):
        content = response.get("choices", [])[0].get("message", {}).get("content", "")
        logger.info(f"name result 생성 응답값: {content}")
        return content
    return response


async def toxic_check(content):
    return False
    #
    # url = "https://api-cloud-function.elice.io/cf3b3742-4bf5-433b-9042-bc8c563c25cc/predict"
    #
    # headers = {
    #     "accept": "application/json",
    #     "content-type": "application/json",
    #     "Authorization": f"Bearer {settings.ML_API_KEY}"
    # }
    #
    # # 요청 데이터
    # payload = {"text": [content]}
    #
    # try:
    #     # POST 요청
    #     response = requests.post(url, headers=headers, json=payload)
    #
    #     # 응답 성공 여부 확인
    #     if response.status_code == 200:
    #         result = response.json()
    #         if isinstance(result, list) and result:  # 응답이 리스트이고 비어 있지 않을 때
    #             first_item = result[0]
    #             is_toxic = first_item.get("is_toxic", False)
    #             score = first_item.get("score", 0)
    #
    #             # 조건 확인
    #             if is_toxic and score >= 0.8:
    #                 return True
    #         return False
    #     else:
    #         return f"요청 실패: {response.status_code} - {response.text}"
    # except Exception as e:
    #     return f"응답 처리 중 에러 발생: {str(e)}"


async def one_line_result(result_one, result_two, result_three, user_id):
    # 프롬프트 생성
    prompt = (
        f"{result_one}\n"
        f"{result_two}\n"
        f"{result_three}\n"
        f"이걸 구어체로 MZ하게 한줄 요약 해줘\n"
        f"*다른말은 보내지말고* 딱 한줄대사만 해"
    )

    messages = [{"role": "system", "content": prompt}]

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o",

            messages=messages,
            max_tokens=50,  # 한 줄 요약에 충분한 토큰 설정
            temperature=0.7,  # 적절히 창의적인 응답을 유도

        )

        content = response["choices"][0]["message"]["content"]
        logger.info(f"LLM 한 줄 요약 응답값: {content}")
        return content
    except Exception as e:
        logger.error(f"OpenAI API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="LLM 한 줄 요약 중 오류가 발생했습니다.")


async def test_image_create():
    url = "https://api-cloud-function.elice.io/0133c2f7-9f3f-44b6-a3d6-c24ba8ef4510/generate"

    # 분위기를 랜덤하게 설정하기 위한 키워드 리스트
    moods = [
        "cheerful and lively",  # 활기차고 즐거운
        "calm and focused",  # 차분하고 집중된
        "funny and lighthearted",  # 재미있고 유쾌한
        "friendly and casual",  # 친근하고 캐주얼한
        "professional and inspiring",  # 전문적이고 영감을 주는
        "relaxed and collaborative",  # 편안하고 협력적인
        "exciting and adventurous",  # 신나고 모험적인
        "serene and peaceful",  # 고요하고 평화로운
        "energetic and productive",  # 에너제틱하고 생산적인
        "motivational and supportive",  # 동기부여적이고 지지적인
        "creative and innovative",  # 창의적이고 혁신적인
        "playful and humorous",  # 장난스럽고 유머러스한
        "intense and competitive",  # 강렬하고 경쟁적인
        "welcoming and inclusive",  # 환영받는 느낌이고 포용적인
        "dynamic and fast-paced",  # 역동적이고 빠른 템포의
        "optimistic and forward-thinking",  # 낙관적이고 미래지향적인
        "warm and comforting",  # 따뜻하고 위로가 되는
        "structured and organized",  # 구조적이고 조직적인
        "casual and spontaneous",  # 캐주얼하고 즉흥적인
        "focused and determined"  # 집중적이고 결단력 있는
    ]

    # 분위기와 인원 수 무작위 선택
    selected_mood = random.choice(moods)
    num_characters = random.randint(1, 4)  # 1명에서 10명 사이

    # 프롬프트 생성
    # prompt = (
    #     f"Concept: * {selected_mood} company life *."
    #     f"Illustrate {num_characters} anime character(s) in their 20s-30s, *pretty, hansome* Tall and well-proportioned characters interacting in an office setting. "
    #     f"The characters should be engaged in a {selected_mood} interaction, "
    #     f"showing mature, stylish, and approachable appearances, with visible signs of their current mood. "
    #     f"The background should depict a vibrant and modern office environment that matches the mood. "
    #     f"Do *not* include empty spaces or text in the image. Focus on creating a detailed and dynamic composition."
    # )

    prompt = (
        f"Concept: *Company life* with a mood of **{selected_mood}**. "
        f"Illustrate **{num_characters}** anime characters in their 20s to 30s, **tall and well-proportioned**, "
        f"with strikingly beautiful and handsome features, exuding elegance and charisma. "
        f"The characters should be depicted in a vibrant modern office setting, rendered in the aesthetic of watercolor art. "
        f"Use soft, flowing strokes and delicate color gradients to create a dreamy and visually captivating effect. "
        f"The characters should reflect a **{selected_mood}** interaction through expressive poses, natural gestures, and subtle facial expressions. "
        f"The background should depict a stylish office environment with watercolor elements, including light washes of color, soft textures, "
        f"and gently blended tones to evoke warmth and depth. "
        f"Ensure a harmonious composition with no empty spaces or text, blending the vibrant energy of modern company life with the artistic charm of watercolor painting."
    )

    payload = {
        "prompt": prompt,
        "style": "watercolor",
        "width": 512,
        "height": 1024,
        "steps": 4,
        "num": 1
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzExNTc2NzMsIm5iZiI6MTczMTE1NzY3Mywia2V5X2lkIjoiYzg2MWQ2MDQtN2I4Yi00MGNjLThkZmYtZGZlYzFhNDA1ZDRhIn0.ZIcLVo0ZGBIYjdNuRM20auHli6Msql36Cptzc1qBs50"
    }

    # Call the generate request
    response_data = await generate_request(url, payload, headers)

    # Extract the encoded image from the predictions key
    if isinstance(response_data, dict) and "predictions" in response_data:
        encoded_image = response_data["predictions"]
    else:
        raise ValueError("Response does not contain 'predictions'")

    # Create image directory
    image_dir = os.path.join(os.getcwd(), "images")
    os.makedirs(image_dir, exist_ok=True)

    # Generate a random file name for the image
    scenario_id = random.randint(1, 1000000)
    image_path = os.path.join(image_dir, f"{scenario_id}.png")

    # Write the decoded image to a file
    with open(image_path, "wb") as image_file:
        image_file.write(base64.b64decode(encoded_image))

    return image_path