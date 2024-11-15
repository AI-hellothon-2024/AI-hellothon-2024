# app/api/endpoints/ws_stt.py

from fastapi import APIRouter, WebSocket
# from whisper import Whisper

router = APIRouter()


@router.websocket("/ws/stt/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # whisper_model = Whisper.load_model("base_model")
    # while True:
    #     data = await websocket.receive_bytes()
    #     text = whisper_model.transcribe(data)
    #     response = {
    #         "text": text,
    #         "sequence": 1,
    #         "status": "processing"
    #     }
    #     await websocket.send_json(response)