from http.client import HTTPException
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from models import Image

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_images(db):
    if db.query(Image).count() == 0:
        demo_images = [
            {"url": "https://picsum.photos/id/201/600/400", "label": "cat", "confidence": 0.8, "is_confirmed": False},
            {"url": "https://picsum.photos/id/202/600/400", "label": "dog", "confidence": 0.7, "is_confirmed": False},
            {"url": "https://picsum.photos/id/203/600/400", "label": "tree", "confidence": 0.9, "is_confirmed": False},
            {"url": "https://picsum.photos/id/204/600/400", "label": "car", "confidence": 0.6, "is_confirmed": False},
            {"url": "https://picsum.photos/id/206/600/400", "label": "mountain", "confidence": 0.85, "is_confirmed": False},
            {"url": "https://picsum.photos/id/208/600/400", "label": "river", "confidence": 0.75, "is_confirmed": False},
            {"url": "https://picsum.photos/id/209/600/400", "label": "house", "confidence": 0.95, "is_confirmed": False},
            {"url": "https://picsum.photos/id/210/600/400", "label": "flower", "confidence": 0.9, "is_confirmed": False},
            {"url": "https://picsum.photos/id/211/600/400", "label": "cat", "confidence": 0.8, "is_confirmed": False},
            {"url": "https://picsum.photos/id/212/600/400", "label": "dog", "confidence": 0.7, "is_confirmed": False},        
        ]
        for img_data in demo_images:
            db.add(Image(**img_data))
        db.commit()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    seed_images(db)
    db.close()

@app.get("/api/hello")
def hello():
    return {"message": "Human Label Assist - Admin Panel"}

@app.get("/api/images/next")
def get_next_image(db: Session = Depends(get_db)):
    image = db.query(Image).filter_by(is_confirmed=False).first()
    if image:
        return {"id": image.id, "url": image.url, "suggested_label": image.label, "confidence": image.confidence}
    return {"message": "All images reviewed", "done": True}

@app.post("/api/labels")
def confirm_image(payload: dict, db: Session = Depends(get_db)):
    image_id = payload.get("image_id")
    if not image_id:
        raise HTTPException(status_code=404, detail="image_id cannot be empty")
    image = db.query(Image).filter_by(id=image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    image.label = payload.get("label", image.label)
    image.is_confirmed = True
    image.confidence = 1.0
    db.commit()
    db.refresh(image)
    return {"id": image.id, "label": image.label, "is_confirmed": image.is_confirmed, "confidence": image.confidence}

# helper for testing
@app.get("/api/images/confirmed") 
def get_confirmed(db: Session = Depends(get_db)): 
    images = db.query(Image).filter_by(is_confirmed=True).all() 
    return [{"id": img.id, "url": img.url, "label": img.label, "confidence": img.confidence} for img in images]