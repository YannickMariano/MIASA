import io
import os
import threading
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
import torch
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(os.getenv("YOLO_MODEL_PATH", BASE_DIR / "models" / "best.pt")).resolve()
CONFIDENCE = float(os.getenv("YOLO_CONFIDENCE", "0.25"))

app = FastAPI(title="Tanimboly YOLO API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://127.0.0.1:4000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_model = None
_model_lock = threading.Lock()


def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.is_file():
            raise RuntimeError(f"Modèle introuvable : {MODEL_PATH}")
        _model = YOLO(str(MODEL_PATH))
    return _model


@app.get("/health")
def health():
    try:
        model = get_model()
        return {
            "status": "ok",
            "model": MODEL_PATH.name,
            "device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU",
            "classes": len(model.names),
        }
    except Exception as error:
        return {"status": "error", "message": str(error)}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(415, "Le fichier doit être une image.")
    try:
        image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    except (UnidentifiedImageError, OSError, ModuleNotFoundError):
        raise HTTPException(400, "L'image est illisible ou invalide.")

    try:
        model = get_model()
        with _model_lock:
            result = model.predict(image, conf=CONFIDENCE, device=0, verbose=False)[0]
    except RuntimeError as error:
        raise HTTPException(503, str(error))
    except Exception as error:
        raise HTTPException(500, f"Échec de l'analyse YOLO : {error}")

    detections = []
    best_by_class = {}
    if result.boxes is not None:
        for box in result.boxes:
            class_id = int(box.cls[0].item())
            score = float(box.conf[0].item())
            label = str(model.names[class_id])
            detection = {
                "label": label,
                "score": score,
                "box": [round(float(value), 2) for value in box.xyxy[0].tolist()],
            }
            detections.append(detection)
            previous = best_by_class.get(label)
            if previous is None or score > previous["score"]:
                best_by_class[label] = {"label": label, "score": score}

    predictions = sorted(best_by_class.values(), key=lambda item: item["score"], reverse=True)[:3]
    return {
        "model": MODEL_PATH.name,
        "predictions": predictions,
        "detections": detections,
        "image": {"width": image.width, "height": image.height},
    }
