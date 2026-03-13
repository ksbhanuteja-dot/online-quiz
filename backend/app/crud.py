from sqlalchemy.orm import Session
from . import models, schemas
import datetime

def create_quiz(db: Session, quiz: schemas.QuizCreate, instructor_id: int):
	db_quiz = models.Quiz(
		title=quiz.title,
		timer_minutes=quiz.timer_minutes,
		instructor_id=instructor_id,
		created_at=datetime.datetime.utcnow()
	)
	db.add(db_quiz)
	db.commit()
	db.refresh(db_quiz)
	for q in quiz.questions:
		db_question = models.Question(
			quiz_id=db_quiz.id,
			text=q.text,
			option_a=q.option_a,
			option_b=q.option_b,
			option_c=q.option_c,
			option_d=q.option_d,
			correct_option=q.correct_option
		)
		db.add(db_question)
	db.commit()
	return db_quiz

def get_quizzes(db: Session):
	return db.query(models.Quiz).all()

def get_quiz(db: Session, quiz_id: int):
	return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()

def save_result(db: Session, result: schemas.ResultCreate):
	db_result = models.Result(
		quiz_id=result.quiz_id,
		student_id=result.student_id,
		score=result.score,
		submitted_at=datetime.datetime.utcnow()
	)
	db.add(db_result)
	db.commit()
	db.refresh(db_result)
	return db_result
