from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        email=user.email,
        name=user.name,
        role=user.role,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

# Quiz CRUD
def get_quizzes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Quiz).offset(skip).limit(limit).all()

def get_quiz(db: Session, quiz_id: int):
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()

def create_quiz(db: Session, quiz: schemas.QuizCreate, instructor_id: int):
    db_quiz = models.Quiz(
        title=quiz.title,
        description=quiz.description,
        timer=quiz.timer,
        instructor_id=instructor_id
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    # Add questions
    for q in quiz.questions:
        db_question = models.Question(
            quiz_id=db_quiz.id,
            question_text=q.question_text,
            options=q.options,
            correct_option=q.correct_option
        )
        db.add(db_question)

    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def update_quiz(db: Session, quiz_id: int, quiz: schemas.QuizUpdate):
    db_quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if db_quiz:
        db_quiz.title = quiz.title
        db_quiz.description = quiz.description
        db_quiz.timer = quiz.timer

        # Delete existing questions
        db.query(models.Question).filter(models.Question.quiz_id == quiz_id).delete()

        # Add new questions
        for q in quiz.questions:
            db_question = models.Question(
                quiz_id=quiz_id,
                question_text=q.question_text,
                options=q.options,
                correct_option=q.correct_option
            )
            db.add(db_question)

        db.commit()
        db.refresh(db_quiz)
    return db_quiz

def delete_quiz(db: Session, quiz_id: int):
    db.query(models.Quiz).filter(models.Quiz.id == quiz_id).delete()
    db.commit()

# Quiz Result CRUD
def create_quiz_result(db: Session, quiz_id: int, student_id: int, score: float, answers: list):
    db_result = models.QuizResult(
        quiz_id=quiz_id,
        student_id=student_id,
        score=score,
        answers=answers
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_student_results(db: Session, student_id: int):
    results = db.query(
        models.QuizResult,
        models.Quiz.title.label('quiz_title')
    ).join(models.Quiz).filter(models.QuizResult.student_id == student_id).all()

    return [
        {
            "id": result.QuizResult.id,
            "quiz_title": result.quiz_title,
            "score": result.QuizResult.score,
            "date": result.QuizResult.completed_at.strftime("%Y-%m-%d"),
            "time": result.QuizResult.completed_at.strftime("%H:%M")
        }
        for result in results
    ]

def get_leaderboard(db: Session):
    # Get top 10 scores
    results = db.query(
        models.User.name,
        func.max(models.QuizResult.score).label('score'),
        func.min(models.QuizResult.completed_at).label('time')
    ).join(models.QuizResult).group_by(models.User.id, models.User.name).order_by(func.max(models.QuizResult.score).desc()).limit(10).all()

    return [
        {
            "name": result.name,
            "score": result.score,
            "time": result.time.strftime("%H:%M") if result.time else "N/A"
        }
        for result in results
    ]

def get_analytics(db: Session, instructor_id: int):
    # Get instructor's quizzes
    quizzes = db.query(models.Quiz).filter(models.Quiz.instructor_id == instructor_id).all()
    total_quizzes = len(quizzes)

    # Get all results for instructor's quizzes
    results = db.query(models.QuizResult).join(models.Quiz).filter(models.Quiz.instructor_id == instructor_id).all()

    total_students = len(set(r.student_id for r in results))
    average_score = sum(r.score for r in results) / len(results) if results else 0

    # Quiz performance
    quiz_performance = []
    for quiz in quizzes:
        quiz_results = [r for r in results if r.quiz_id == quiz.id]
        avg_score = sum(r.score for r in quiz_results) / len(quiz_results) if quiz_results else 0
        quiz_performance.append({
            "title": quiz.title,
            "attempts": len(quiz_results),
            "average_score": avg_score
        })

    return {
        "total_quizzes": total_quizzes,
        "total_students": total_students,
        "average_score": average_score,
        "quiz_performance": quiz_performance
    }

def get_quiz_analytics(db: Session, quiz_id: int):
    # Get quiz
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        return None

    # Get results for this quiz
    results = db.query(models.QuizResult).filter(models.QuizResult.quiz_id == quiz_id).all()

    total_attempts = len(results)
    total_students = len(set(r.student_id for r in results))
    average_score = sum(r.score for r in results) / len(results) if results else 0

    # Score distribution
    score_ranges = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    for result in results:
        if result.score <= 20:
            score_ranges["0-20"] += 1
        elif result.score <= 40:
            score_ranges["21-40"] += 1
        elif result.score <= 60:
            score_ranges["41-60"] += 1
        elif result.score <= 80:
            score_ranges["61-80"] += 1
        else:
            score_ranges["81-100"] += 1

    # Top performers
    top_performers = []
    for result in sorted(results, key=lambda x: x.score, reverse=True)[:5]:
        student = db.query(models.User).filter(models.User.id == result.student_id).first()
        top_performers.append({
            "name": student.name if student else "Unknown",
            "score": result.score,
            "time": result.time.strftime("%H:%M") if result.time else "N/A"
        })

    return {
        "quiz_title": quiz.title,
        "total_attempts": total_attempts,
        "total_students": total_students,
        "average_score": average_score,
        "score_distribution": score_ranges,
        "top_performers": top_performers
    }
