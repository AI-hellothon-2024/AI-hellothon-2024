#보안 관련 설정
# from datetime import datetime, timedelta
# from typing import Optional
# import jwt 
#
# SECRET_KEY = ""
# ALGORITHM = "HS256"
#
# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)