from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Question schemas
class QuestionBase(BaseModel):
    question_text: str
    options: List[str]
    correct_option: int

class Question(QuestionBase):
    id: int

    class Config:
        from_attributes = True

# Quiz schemas
class QuizBase(BaseModel):
    title: str
    description: str
    timer: int

class QuizCreate(QuizBase):
    questions: List[QuestionBase]

class QuizUpdate(QuizBase):
    questions: List[QuestionBase]

class Quiz(QuizBase):
    id: int
    instructor_id: int
    questions: List[Question]
    created_at: datetime

    class Config:
        from_attributes = True

# Quiz result schemas
class Answers(BaseModel):
    answers: List[int]

class QuizResult(BaseModel):
    score: float
    correct_answers: int
    total_questions: int
    result_id: int

class QuizResultDetail(BaseModel):
    id: int
    quiz_title: str
    score: float
    date: str
    time: str

    class Config:
        from_attributes = True

# Leaderboard schemas
class LeaderboardEntry(BaseModel):
    name: str
    score: float
    time: str

# Analytics schemas
class Analytics(BaseModel):
    total_quizzes: int
    total_students: int
    average_score: float
    quiz_performance: List[dict]

class QuizAnalytics(BaseModel):
    quiz_title: str
    total_attempts: int
    total_students: int
    average_score: float
    score_distribution: dict
    top_performers: List[dict]
