from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from . import models, schemas, crud

Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.post("/api/quizzes/", response_model=schemas.Quiz)
def create_quiz(
	quiz: schemas.QuizCreate,
	instructor_id: int = Query(..., description="Instructor ID"),
	db: Session = Depends(get_db)
):
	return crud.create_quiz(db, quiz, instructor_id)

@app.get("/quizzes/", response_model=list[schemas.Quiz])
def get_quizzes(db: Session = Depends(get_db)):
	return crud.get_quizzes(db)

@app.get("/quizzes/{quiz_id}", response_model=schemas.Quiz)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
	quiz = crud.get_quiz(db, quiz_id)
	if not quiz:
		raise HTTPException(status_code=404, detail="Quiz not found")
	return quiz

@app.post("/results/", response_model=schemas.Result)
def submit_result(result: schemas.ResultCreate, db: Session = Depends(get_db)):
	return crud.save_result(db, result)
