import requests
import logging
import json
from app.core.config import settings

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


async def llm_scenario_create(job, situation, gender, scenario_id, scenario_step, user_id):
    url = "https://api-cloud-function.elice.io/5a327f26-cc55-45c5-92b7-e909c2df0ba4/v1/chat/completions"

    # 프롬프트 생성
    prompt = (
        f"나는 다음의 조건에 따라서 롤플레잉을 진행하고 싶다.\n"
        f"직업은 '{job}' 이며, 내 성별은 {gender}, 직업에 따라 대화 환경을 결정해라.\n"
        f"상대는 성별은 내 성별의 반대 성별이며 성격은 랜덤으로 설정한다. 성격은 더러운 성격부터 좋은 성격까지 아무것도 가리지 않는다.\n"
        f"상황은 '{situation}'이며 이에 따라 롤플레잉을 진행할 것이다.\n"
        f"대화는 최종상황까지 천천히 빌드업 하는 걸로 한다.\n"
        f"상대가 한마디하면 내가 대답을 기다린다. 채팅시뮬레이션 하듯이! 바로 대화부터 진행해 앞의 설명이나 기타 다른 건 필요없어.\n"
        f"시작합니다, 성격설명 등등은 설정 설명은 전혀 필요없다."
    )

    payload = {
        "model": "helpy-pro",
        "sess_id": user_id,
        "messages": [
            {
                "role": "user",
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
            return content  # 문자열 형태로 반환
        except Exception as e:
            return f"LLM 생성 응답 처리 중 에러 발생: {str(e)}"
    else:
        return f"LLM 생성 응답 요청 실패: {response.status_code} - {response.text}"


async def image_create(content, gender):
    url = "https://api-cloud-function.elice.io/0133c2f7-9f3f-44b6-a3d6-c24ba8ef4510/generate"

    # 성별 텍스트 변환
    gender_text = "남성" if gender == "F" else "여성"

    prompt = (
        f"다음 대화를 보고 상황에 맞는 {gender_text} 이미지를 생성해줘.\n"
        f"대화: {content}\n"
        f"그림체는 일본 애니메이션 그림체로 그려줘.\n"
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
