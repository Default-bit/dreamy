"""Fairy Tale Generator"""
from utils import clean_text_for_audio
from datetime import datetime
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware
from rag.retriever import retrieve_cultural_snippets
from typing import List
from jose import jwt, JWTError
from auth import hash_password, verify_password, create_token
from models import User, Story
from db import SessionLocal, init_db
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
import uuid
from gtts import gTTS
import os
from typing import Optional
from pydantic import BaseModel, Field
from huggingface_hub import InferenceClient
from fastapi import FastAPI
from dotenv import load_dotenv

# Environment setup
os.environ['CURL_CA_BUNDLE'] = ''

load_dotenv()

# Initialize the Hugging Face client
HF_TOKEN = os.getenv("HF_TOKEN")
client = InferenceClient(
    provider="nebius",
    api_key=HF_TOKEN,
)

# FastAPI app instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserLogin(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class StoryRequest(BaseModel):
    """Request model for generating a fairy tale."""
    age: str = Field(...,
                     description="Age group label (e.g., 'Young Children (5-8 years)')")
    moral: str = Field(..., description="Core lesson or value of the story")
    length: str = Field(...,
                        description="Story length: short, medium, or long")
    language: str = Field(...,
                          description="Language (e.g., 'English', 'Kazakh')")
    topic: str = Field(...,
                       description="Story theme or topic (e.g., space, animals)")
    scientific_note: Optional[str] = Field(
        None, description="Scientific concept to explain in story")
    culture: Optional[str] = Field(
        None, description="Cultural context for the story")
    with_audio: bool = False


init_db()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
oauth2_scheme = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.email).first():
        raise HTTPException(status_code=400, detail="Email already taken")

    new_user = User(
        username=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token(data={"sub": new_user.username})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/token")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(data={"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}


SECRET_KEY = "supersecretkey"  # Store securely!
ALGORITHM = "HS256"


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        token = credentials.credentials  # Extract actual token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/generate")
async def generate_story(request: StoryRequest,
                         current_user: User = Depends(get_current_user),
                         db: Session = Depends(get_db)):
    """Generate a fairy tale based on the provided request."""
    prompt = build_prompt(request)
    print(f"Prompt: {prompt}")

    # completion = client.chat.completions.create(
    #     model="Qwen/Qwen3-235B-A22B",
    #     messages=[{"role": "user", "content": prompt}],
    # )

    # story = completion.choices[0].message["content"]

    story = f"""
    Magical Land Fairy Tale 🌈
    <think> User wants a fairy tale for children about {request.topic} with a moral lesson: {request.moral}. </think>
    Once upon a time in a magical land, there lived a curious child who loved {request.topic}.
    They learned an important lesson: {request.moral} 🌟
    Once upon a time in a magical land, there lived a curious child who loved {request.topic}.
    They learned an important lesson: {request.moral} 🌟
    The end
    """

    result = {"story": story}
    audio_path = None

    if request.with_audio:
        formatted_story = clean_text_for_audio(story)
        audio_path = text_to_speech(formatted_story, language=request.language)
        result["audio_url"] = f"http://localhost:8000{audio_path}"

    db_story = Story(id=str(uuid.uuid4()), content=story,
                     audio_url=audio_path, owner=current_user)
    db.add(db_story)
    db.commit()

    return {
        "id": db_story.id,
        "story": story,
        "audio_url": result.get("audio_url"),
        "created_at": db_story.created_at.isoformat()
    }


app.mount("/static", StaticFiles(directory="static"), name="static")


AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)


def text_to_speech(text: str, language: str = "en") -> str:
    """Convert text to speech and save it as an audio file."""
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    # gTTS may not support all language codes like 'kk', fallback to 'en' if needed
    try:
        tts = gTTS(text=text, lang=language)
        tts.save(filepath)
    except:
        tts = gTTS(text=text, lang="en")
        tts.save(filepath)

    return f"/{AUDIO_DIR}/{filename}"


@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username}


@app.get("/stories")
def get_user_stories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stories = db.query(Story).filter(Story.user_id == current_user.id).order_by(
        Story.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "content": s.content,
            "audio_url": s.audio_url,
            "created_at": s.created_at.isoformat()
        }
        for s in stories
    ]


@app.get("/rag/snippets")
def get_rag_snippets(topic: str, culture: str):
    from rag.retriever import retrieve_cultural_snippets
    return retrieve_cultural_snippets(topic, culture)


def build_prompt(req: StoryRequest) -> str:
    prompt = f"Write a {req.length.lower()} fairy tale for the age group '{req.age}' "

    if req.culture:
        prompt += f"that includes elements of {req.culture} culture "
    else:
        prompt += "that is culturally universal "

    prompt += f"on the topic of {req.topic}. The story should teach the moral: '{req.moral}'. "

    if req.scientific_note:
        prompt += f"Also explain the concept of {req.scientific_note} simply. "

    prompt += f"Tell the story in {req.language}.\n\n"

    prompt += f"Use a creative, storybook-style title at the top. Include a simple beginning, middle, and end. Use friendly, magical language. End the story with a line that says “The End.” Do not include any other commentary or explanation."

    if req.culture:
        snippets = retrieve_cultural_snippets(req.topic, req.culture)
        if snippets:
            prompt += "You can draw inspiration from these real folklore examples:\n"
            for snip in snippets:
                prompt += f"- {snip.strip()}\n"

    return prompt


# @app.get("/tale/{tale_id}")
# def get_tale_by_id(tale_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     tale = db.query(Story).filter(Story.id == tale_id,
#                                   Story.user_id == current_user.id).first()
#     if not tale:
#         raise HTTPException(status_code=404, detail="Tale not found")
#     return {
#         "id": tale.id,
#         "content": tale.content,
#         "audio_url": tale.audio_url,
#         "created_at": tale.created_at.isoformat()
#     }


class SaveTaleRequest(BaseModel):
    id: str
    content: str
    audio_url: Optional[str] = None
    created_at: str


@app.post("/stories/save")
def save_story(data: SaveTaleRequest,
               current_user: User = Depends(get_current_user),
               db: Session = Depends(get_db)):

    exists = db.query(Story).filter(Story.id == data.id,
                                    Story.user_id == current_user.id).first()

    if exists:
        db.delete(exists)
        db.commit()
        return {"status": "unsaved"}
    else:
        db_story = Story(
            id=data.id,
            content=data.content,
            audio_url=data.audio_url,
            user_id=current_user.id,
            created_at=datetime.fromisoformat(
                data.created_at.replace("Z", "+00:00")),  # ← Fix here
        )
        db.add(db_story)
        db.commit()
        return {"status": "saved"}
