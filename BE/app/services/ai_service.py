import requests
import logging
import random
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

async def llm_scenario_create(job, situation, gender, before_scenario_content, scenario_step, user_id, before_settings):
    url = "https://api-cloud-function.elice.io/5a327f26-cc55-45c5-92b7-e909c2df0ba4/v1/chat/completions"

    logger.info("situation: " + situation)
    # 상황
    selected_situation = await db["situations"].find_one({"name": situation})
    if selected_situation:
        situation_description = str(selected_situation.get("description", ""))
    else:
        situation_description = "직장 동료와 함께 퇴근하는 상황(어색함)"  # 상황에 따라 기본값 설정

    logger.info("situation_description: " + situation_description)

    # 성격
    random_number = random.randint(1, 100)
    choose_personalities = await db["personalities"].find_one({"number": random_number})
    personalities = choose_personalities['trait']

    logger.info("personalities: " + personalities)

    system_gender = "male" if gender == "male" else "female"

    logger.info("system_gender: " + system_gender)

    # 프롬프트 생성
    if scenario_step == "1":
        prompt = (
            f"현재 대화의 STEP은 {scenario_step} 입니다.\n"
            f"#Role\n"
            f"- 직업: {job}\n"
            f"- 성별: {system_gender}\n"
            f"- 역활: {situation_description}\n"
            f"- 성격: {personalities}\n\n"
            f"#Order\n"
            f"1. 부여된 Role에 맞춰 user에게 먼저 대화를 건다.\n"
            f"2. 아래 부여된 Rule은 절대적으로 지켜라.\n\n"
            f"#Rule\n"
            f"1. 너는 반드시 규칙을 지킴.\n"
            f"2. **(필수)응답은 어떤 회차이던 반드시 Result에 명시된 형식대로 응답해야한다.\n"
            f"3. 대화는 1번씩 주고 받는다.\n"
            f"4. 대화 흐름에 안맞는 말은 하지 않는다.\n"
            f"5. 설정된 역활, 성격에서 벗어나는 말은 하지 않는다.\n"
            f"6. 10회 내외로 대화가 **자연스럽게** 끝나도록 한다.\n"
            f"7. 대화 종료를 유도할때 마지막 답변의 step:::은 end 이다.\n\n"
            f"#Result\n"
            f"step::: (대화의 회차를 작성하는 부분)\n"
            f"setting::: (Role을 작성하는 부분)\n"
            f"start::: (너의 대사를 작성하는 부분)\n"
        )
        messages = [{"role": "system", "content": prompt}]
    else:
        previous_conversation = [
            {"role": entry["role"], "content": entry["content"]}
            for entry in before_scenario_content
        ]
        prompt = (
            f"현재 대화의 STEP은 1 입니다.\n"
            f"#Role\n"
            f"- 직업: {job}\n"
            f"- 성별: {system_gender}\n"
            f"- 역활: {situation_description}\n"
            f"- 성격: {before_settings}\n\n"
            f"#Order\n"
            f"1. 부여된 Role에 맞춰 user에게 먼저 대화를 건다.\n"
            f"2. 아래 부여된 Rule은 절대적으로 지켜라.\n\n"
            f"#Rule\n"
            f"1. 너는 반드시 규칙을 지킴.\n"
            f"2. **(필수)응답은 어떤 회차이던 반드시 Result에 명시된 형식대로 응답해야한다.\n"
            f"3. 대화는 1번씩 주고 받는다.\n"
            f"4. 대화 흐름에 안맞는 말은 하지 않는다.\n"
            f"5. 설정된 역활, 성격에서 벗어나는 말은 하지 않는다.\n"
            f"6. 10회 내외로 대화가 **자연스럽게** 끝나도록 한다.\n"
            f"7. 대화 종료를 유도할때 마지막 답변의 step:::은 end 이다.\n\n"
            f"#Result\n"
            f"step::: (대화의 회차를 작성하는 부분)\n"
            f"setting::: (Role을 작성하는 부분)\n"
            f"start::: (너의 대사를 작성하는 부분)\n"
        )
        messages = previous_conversation + [{"role": "system", "content": prompt}]

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

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        try:
            response_data = response.json()
            content = response_data.get("choices", [])[0].get("message", {}).get("content", "")
            logger.info(f"LLM 생성 응답값: {content}")

            return content
        except Exception as e:
            return f"LLM 생성 응답 처리 중 에러 발생: {str(e)}"
    else:
        return f"LLM 생성 응답 요청 실패: {response.status_code} - {response.text}"


async def image_create(content, gender, before_image):
    url = "https://api-cloud-function.elice.io/0133c2f7-9f3f-44b6-a3d6-c24ba8ef4510/generate"

    before_image_url = f"https://zmxpjsmxtgzthtqs.tunnel-pt.elice.io/static/{before_image}"

    prompt = (
        f"대화: {content}\n"
        f"그림체는 일본 애니메이션 그림체로 그려줘.\n"
        f"말풍선 and 글자는 *절대절대* 이미지에 들어가선 안돼\n"
        f"대화에서 등장인물의 대사와 성격 묘사된 자세 등 세세하게 캐치해서 그려줘.\n"
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

    # 요청 전송 및 응답 처리
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        try:
            response_data = response.json()
            return response_data.get("predictions", "이미지 생성 실패")  # 이미지 URL 또는 생성 실패 메시지 반환
        except Exception as e:
            return f"이미지 생성 응답 처리 중 에러 발생: {str(e)}"
    else:
        return f"이미지 생성 요청 실패: {response.status_code} - {response.text}"
