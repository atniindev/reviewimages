import uuid
from sqlalchemy import Column, String, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    url = Column(String, unique=True)
    is_confirmed = Column(Boolean, default=False)
    label = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)