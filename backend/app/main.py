from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from typing import List, Optional
import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Online Quiz API")

# Security
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to the Online Quiz API"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user, hashed_password=get_password_hash(user.password))

@app.post("/login/", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/quizzes/", response_model=List[schemas.Quiz])
def read_quizzes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    quizzes = crud.get_quizzes(db, skip=skip, limit=limit)
    return quizzes

@app.post("/quizzes/", response_model=schemas.Quiz)
def create_quiz(quiz: schemas.QuizCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can create quizzes")
    return crud.create_quiz(db=db, quiz=quiz, instructor_id=current_user.id)

@app.get("/quizzes/{quiz_id}", response_model=schemas.Quiz)
def read_quiz(quiz_id: int, db: Session = Depends(get_db)):
    db_quiz = crud.get_quiz(db, quiz_id=quiz_id)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz

@app.put("/quizzes/{quiz_id}", response_model=schemas.Quiz)
def update_quiz(quiz_id: int, quiz: schemas.QuizUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_quiz = crud.get_quiz(db, quiz_id=quiz_id)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    if db_quiz.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this quiz")
    return crud.update_quiz(db=db, quiz_id=quiz_id, quiz=quiz)

@app.delete("/quizzes/{quiz_id}")
def delete_quiz(quiz_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_quiz = crud.get_quiz(db, quiz_id=quiz_id)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    if db_quiz.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this quiz")
    crud.delete_quiz(db=db, quiz_id=quiz_id)
    return {"message": "Quiz deleted"}

@app.post("/quizzes/{quiz_id}/submit", response_model=schemas.QuizResult)
def submit_quiz(quiz_id: int, answers: schemas.Answers, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_quiz = crud.get_quiz(db, quiz_id=quiz_id)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Calculate score
    correct_answers = 0
    for i, answer in enumerate(answers.answers):
        if i < len(db_quiz.questions) and answer == db_quiz.questions[i].correct_option:
            correct_answers += 1

    score = (correct_answers / len(db_quiz.questions)) * 100
    total_questions = len(db_quiz.questions)

    # Save result
    result = crud.create_quiz_result(db=db, quiz_id=quiz_id, student_id=current_user.id, score=score, answers=answers.answers)

    return {
        "score": score,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "result_id": result.id
    }

@app.get("/students/{student_id}/results", response_model=List[schemas.QuizResultDetail])
def read_student_results(student_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.id != student_id and current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.get_student_results(db, student_id=student_id)

@app.get("/leaderboard/", response_model=List[schemas.LeaderboardEntry])
def read_leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)

@app.post("/quizzes/{quiz_id}/progress")
def save_progress(quiz_id: int, answers: schemas.Answers, current_user: models.User = Depends(get_current_user)):
    # For now, just return success. In a real app, you'd save progress to database
    return {"message": "Progress saved"}

@app.get("/analytics/", response_model=schemas.Analytics)
def read_analytics(quiz_id: Optional[int] = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can view analytics")

    if quiz_id:
        # Quiz-specific analytics
        db_quiz = crud.get_quiz(db, quiz_id=quiz_id)
        if db_quiz is None:
            raise HTTPException(status_code=404, detail="Quiz not found")
        if db_quiz.instructor_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to view this quiz's analytics")

        analytics = crud.get_quiz_analytics(db, quiz_id=quiz_id)
        # Convert to Analytics format for frontend compatibility
        return {
            "total_quizzes": 1,
            "total_students": analytics["total_students"],
            "average_score": analytics["average_score"],
            "quiz_performance": [{
                "title": analytics["quiz_title"],
                "attempts": analytics["total_attempts"],
                "average_score": analytics["average_score"]
            }]
        }
    else:
        # General instructor analytics
        return crud.get_analytics(db, instructor_id=current_user.id)
