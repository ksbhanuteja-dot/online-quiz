from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Instructor(Base):
	__tablename__ = "instructors"
	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	email = Column(String, unique=True, index=True, nullable=False)
	quizzes = relationship("Quiz", back_populates="instructor")

class Student(Base):
	__tablename__ = "students"
	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	email = Column(String, unique=True, index=True, nullable=False)
	results = relationship("Result", back_populates="student")

class Quiz(Base):
	__tablename__ = "quizzes"
	id = Column(Integer, primary_key=True, index=True)
	title = Column(String, nullable=False)
	timer_minutes = Column(Integer, nullable=False)
	instructor_id = Column(Integer, ForeignKey("instructors.id"))
	created_at = Column(DateTime, default=datetime.datetime.utcnow)
	instructor = relationship("Instructor", back_populates="quizzes")
	questions = relationship("Question", back_populates="quiz")
	results = relationship("Result", back_populates="quiz")

class Question(Base):
	__tablename__ = "questions"
	id = Column(Integer, primary_key=True, index=True)
	quiz_id = Column(Integer, ForeignKey("quizzes.id"))
	text = Column(String, nullable=False)
	option_a = Column(String, nullable=False)
	option_b = Column(String, nullable=False)
	option_c = Column(String, nullable=False)
	option_d = Column(String, nullable=False)
	correct_option = Column(String, nullable=False)
	quiz = relationship("Quiz", back_populates="questions")

class Result(Base):
	__tablename__ = "results"
	id = Column(Integer, primary_key=True, index=True)
	quiz_id = Column(Integer, ForeignKey("quizzes.id"))
	student_id = Column(Integer, ForeignKey("students.id"))
	score = Column(Float, nullable=False)
	submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
	quiz = relationship("Quiz", back_populates="results")
	student = relationship("Student", back_populates="results")
