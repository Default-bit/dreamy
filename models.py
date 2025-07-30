from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(100))

    stories = relationship("Story", back_populates="owner")


class Story(Base):
    __tablename__ = "stories"
    id = Column(String, primary_key=True)
    content = Column(Text)
    audio_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="stories")
