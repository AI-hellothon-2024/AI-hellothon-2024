import requests
import logging
import random
from app.core.config import settings
from app.db.session import get_database
from deep_translator import GoogleTranslator

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


async def generate_request(url, payload, headers):
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        try:
            return response.json()
        except Exception as e:
            return f"응답 처리 중 에러 발생: {str(e)}"
    else:
        return f"요청 실패: {response.status_code} - {response.text}"


async def llm_scenario_create(job, situation, gender, before_scenario_content, scenario_step, user_id, before_settings):
    url = "https://api-cloud-function.elice.io/5a327f26-cc55-45c5-92b7-e909c2df0ba4/v1/chat/completions"

    logger.info("situation: " + situation)
    # 상황
    selected_situation = await db["situations"].find_one({"name": situation})
    situation_description = str(selected_situation.get("description", "기본값")) if selected_situation else "기본값"
    logger.info("situation_description: " + situation_description)

    # 성격
    random_number = random.randint(1, 100)
    choose_personalities = await db["personalities"].find_one({"number": random_number})
    personalities = choose_personalities['trait']
    logger.info("personalities: " + personalities)

    system_gender = "male" if gender == "female" else "female"
    logger.info("system_gender: " + system_gender)

    # 프롬프트 생성
    prompt = (
        f"현재 대화의 STEP은 {scenario_step} 입니다.\n"
        f"#절대적인 응답형식\n"
        f"step::: (대화의 회차를 작성하는 부분)\n"
        f"setting::: (Role을 작성하는 부분)\n"
        f"start::: (너의 대사를 작성하는 부분)\n\n"
        f"#Role\n"
        f"- 직업: {job}\n"
        f"- 성별: {system_gender}\n"
        f"- 역활: {situation_description}\n"
        f"- 성격: {before_settings if scenario_step != '1' else personalities}\n\n"
        f"#Order\n"
        f"1. 부여된 Role에 맞춰 user에게 먼저 대화를 건다.\n"
        f"2. 아래 부여된 Rule은 절대적으로 지켜라.\n\n"
        f"#Rule\n"
        f"- 너는 반드시 규칙을 지킴.\n"
        f"- **(필수)응답은 어떤 회차이던 반드시 Result에 명시된 형식대로 응답해야한다.\n"
        f"- 대화는 1번씩 주고 받는다.\n"
        f"- 대화 흐름에 안맞는 말은 하지 않는다.\n"
        f"- 설정된 역활, 성격에서 벗어나는 절대 말은 하지 않는다. 역활만을 위해 대화한다.\n"
        f"- 설정된 역활, 성격에 맞도록 심한말도 허용함.\n"
        f"- 같은 말은 반복하지 않는다.\n"
        f"- 10회 내외로 대화를 끝나도록 한다.\n"
        f"- 대화 종료할때 마지막 답변의 step:::은 end 이다.\n"
    )

    messages = [{"role": "system", "content": prompt}]
    if scenario_step != "1":
        messages += [{"role": entry["role"], "content": entry["content"]} for entry in before_scenario_content]

    logger.info(f"LLM 생성 prompt: {messages}")

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
        logger.info(f"LLM 생성 응답값: {content}")
        return content
    return response


async def image_create(content, gender, situation):
    url = "https://api-cloud-function.elice.io/0133c2f7-9f3f-44b6-a3d6-c24ba8ef4510/generate"

    # translated_content = GoogleTranslator(source='auto', target='en').translate(content)
    #
    # prompt = (
    #     f"Conversation: {translated_content}\n"
    #     f"Gender: {gender}\n"
    #     f"Nationality: Korean\n"
    #     f"Do *not* include any text in the image.\n"
    #     f"Please capture the character's dialogue, posture, and expressions in detail based on the conversation, and generate it in a realistic style.\n"
    # )
    system_gender = "male" if gender == "female" else "female"
    logger.info("system_gender: " + system_gender)

    prompt = (
        f"concept : {situation}\n"
        f"대사 : {content}\n"
        f"{system_gender}, 동양인, 일본애니메이션캐릭터, 30대\n"
        f"이미지에 text를 *절대* 포함하지 마십시오.\n"
        f"concept, 대화를 기반으로 캐릭터의 대사, 자세, 표정을 상세히 담아 사실적인 스타일로 생성해주세요.\n"
    )

    payload = {
        "prompt": prompt,
        "style": "polaroid",
        "width": 512,
        "height": 1024,
        "steps": 4,
        "num": 1
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {settings.ML_API_KEY}"
    }

    response = await generate_request(url, payload, headers)
    if isinstance(response, dict):
        return response.get("predictions", "Image generation failed")  # Return image URL or failure message
    return response
