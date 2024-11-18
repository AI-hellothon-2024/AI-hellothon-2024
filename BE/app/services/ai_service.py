import requests
import logging
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

    selected_situation = await db["situations"].find_one({"name": situation})
    if selected_situation:
        situation_description = str(selected_situation.get("description", ""))
    else:
        situation_description = "직장 동료와 함께 퇴근하는 상황(어색함)"  # 상황에 따라 기본값 설정

    # 프롬프트 생성
    if scenario_step == "1":
        prompt = (
            f"다음의 조건에 따라 대화를 시작합니다:\n"
            f"- 내 직업: '{job}'\n"
            f"- 내 성별: '{gender}'\n"
            f"- 상황: '{situation_description}'\n"
            f"- 상대방 성격과 역할: {before_settings if before_settings else '랜덤으로 설정'}\n"
            f"대화는 자연스럽게 발전하며, 최종 상황에 도달하기 전에 천천히 빌드업합니다.\n"
            f"상대방은 매번 한 마디씩 대화를 진행하며, 내 대답을 기다려야 합니다.\n"
            f"응답 형식은 반드시 다음 형식을 따라야 합니다:\n"
            f"  (임의로 정해진 상대의 설정값) setting::: 상대방의 성격과 역할을 명시\n"
            f"  (대화 시작) start::: 상대방의 첫 대사\n"
            f"**주의:** 금지 표현은 '(', ')'이며, 불필요한 헛소리는 피하세요.\n"
        )
    else:
        prompt = (
            f"지금까지의 대화 흐름을 바탕으로 자연스러운 대화를 이어가세요:\n"
            f"- 내 직업: '{job}'\n"
            f"- 내 성별: '{gender}'\n"
            f"- 상대방 성격과 역할: {before_settings}\n"
            f"- 상황: '{situation_description}'\n"
            f"지금까지의 대화 내용:\n"
            f"{before_scenario_content}\n\n"
            f"다음 조건에 따라 대화를 진행하세요:\n"
            f"1. 현재 대화 흐름을 기반으로 자연스럽고 흥미롭게 전개합니다.\n"
            f"2. 상대방의 설정값과 대화 흐름을 일관되게 유지합니다.\n"
            f"3. 대화 종료를 유도해야 한다고 판단되면 첫 줄에 'end'를 추가하세요.\n\n"
            f"응답 형식은 반드시 다음 형식을 따라야 합니다:\n"
            f"  (임의로 정해진 상대의 설정값) setting::: 상대방의 성격과 역할\n"
            f"  (대화 시작) start::: 상대방의 다음 대사\n"
            f"**주의:** 금지 표현은 '(', ')'이며, 비논리적인 응답은 작성하지 마세요.\n"
        )

    payload = {
        "model": "helpy-pro",
        "sess_id": user_id,
        "messages": [
            {
                "role": "system",
                "content": prompt
            }
        ]
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
        f"이전 이미지 URL: {before_image_url}\n"
        f"위 URL을 참고한 뒤 *같은 인물*(중요)이여야 하고 아래 대화를 자세하게 분석해서 이미지를 생성해줘.\n"  
        f"대화: {content}\n"
        f"그림체는 일본 애니메이션 그림체로 그려줘.\n"
        f"말풍선 and 글자는 *절대절대* 이미지에 들어가선 안돼\n"
        f"대화에서 등장인물의 대사와 성격 묘사된 자세 등 세세하게 캐치해서 그려줘.\n"
    )

    payload = {
        "prompt": prompt,
        "style": "polaroid",
        "width": 512,
        "height": 512,
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
