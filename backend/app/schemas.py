from pydantic import BaseModel
from typing import List, Optional
import datetime

class QuestionCreate(BaseModel):
	text: str
	option_a: str
	option_b: str
	option_c: str
	option_d: str
	correct_option: str

class Question(BaseModel):
	id: int
	quiz_id: int
	text: str
	option_a: str
	option_b: str
	option_c: str
	option_d: str
	correct_option: str

	class Config:
		orm_mode = True

class QuizCreate(BaseModel):
	title: str
	timer_minutes: int
	questions: List[QuestionCreate]

class Quiz(BaseModel):
	id: int
	title: str
	timer_minutes: int
	instructor_id: int
	created_at: datetime.datetime
	questions: List[Question]

	class Config:
		orm_mode = True

class ResultCreate(BaseModel):
	quiz_id: int
	student_id: int
	score: float

class Result(BaseModel):
	id: int
	quiz_id: int
	student_id: int
	score: float
	submitted_at: datetime.datetime

	class Config:
		orm_mode = True
