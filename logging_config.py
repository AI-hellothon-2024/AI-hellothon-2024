import logging
from logging.handlers import TimedRotatingFileHandler
import os
from datetime import datetime

# 월별 폴더
current_month_folder = f"logs/{datetime.now().strftime('%Y-%m')}"
os.makedirs(current_month_folder, exist_ok=True)

# 일별 로그 핸들러
daily_log_handler = TimedRotatingFileHandler(
    filename=os.path.join(current_month_folder, "server.log"),
    when="midnight",
    interval=1,
    backupCount=7,
    encoding="utf-8",
)
daily_log_handler.suffix = "%Y-%m-%d"
daily_log_handler.setLevel(logging.DEBUG)

# 콘솔 출력 핸들러 (실시간 로그)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)

# 포맷 설정
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
daily_log_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# 루트 로거에 핸들러 추가
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(daily_log_handler)
logger.addHandler(console_handler)

# 테스트 로그
logger.info("logging test message.")
