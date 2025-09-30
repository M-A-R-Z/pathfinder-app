from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db


# -------------------- User --------------------
class User(db.Model):
    __tablename__ = "user_data"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    affix = db.Column(db.String(50))
    date_joined = db.Column(db.DateTime, server_default=db.func.now())
    password = db.Column(db.String(255), nullable=False)
    middle_name = db.Column(db.String(100))
    birthday = db.Column(db.Date, nullable=False)
    role = db.Column(db.String(50), nullable=False, default="USER")

    def user_info(self):
        return {
            "user_id": self.user_id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "affix": self.affix,
            "date_joined": self.date_joined.isoformat(),
            "middle_name": self.middle_name,
            "birthday": self.birthday.isoformat(),
            "role": self.role,
        }


# -------------------- Question Set --------------------
class QuestionSet(db.Model):
    __tablename__ = "question_sets"

    question_set_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question_set_name = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.String(120))
    questions = db.relationship("Question", backref="set", cascade="all, delete-orphan")
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_updated = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now()
    )

    def question_set_info(self):
        return {
            "question_set_id": self.question_set_id,
            "question_set_name": self.question_set_name,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
        }


# -------------------- Question --------------------
class Question(db.Model):
    __tablename__ = "questions"

    question_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question_text = db.Column(db.Text, nullable=False)
    strand = db.Column(db.String(50), nullable=False)
    set_id = db.Column(
        db.Integer, db.ForeignKey("question_sets.question_set_id"), nullable=False
    )

    def questions_info(self):
        return {
            "question_id": self.question_id,
            "question_text": self.question_text,
            "strand": self.strand,
            "set_id": self.set_id,
        }


# -------------------- DataSet --------------------
class DataSet(db.Model):
    __tablename__ = "data_set"

    data_set_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data_set_name = db.Column(db.String(120), nullable=False, unique=True)
    data_set_description = db.Column(db.String(255))
    question_set_id = db.Column(
        db.Integer, db.ForeignKey("question_sets.question_set_id"), nullable=False
    )
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_updated = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now()
    )
    status = db.Column(db.String(50), nullable=False, default="Inactive")
    data = db.relationship("Data", backref="data_set", cascade="all, delete-orphan")
    question_set = db.relationship("QuestionSet", backref="datasets")

    def data_set_info(self):
        return {
            "data_set_id": self.data_set_id,
            "data_set_name": self.data_set_name,
            "data_set_description": self.data_set_description,
            "question_set_id": self.question_set_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


# -------------------- Data --------------------
class Data(db.Model):
    __tablename__ = "data"

    data_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data_set_id = db.Column(
        "data_set_id",
        db.Integer,
        db.ForeignKey("data_set.data_set_id"),
        nullable=False,
    )
    stem_score = db.Column(db.Integer, nullable=False)
    abm_score = db.Column(db.Integer, nullable=False)
    humss_score = db.Column(db.Integer, nullable=False)
    strand = db.Column(db.String(50), nullable=False)

    def data_info(self):
        return {
            "data_id": self.data_id,
            "data_set_id": self.data_set_id,
            "stem_score": self.stem_score,
            "abm_score": self.abm_score,
            "humss_score": self.humss_score,
            "strand": self.strand,
        }


# -------------------- Course --------------------
class Course(db.Model):
    __tablename__ = "courses"

    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_name = db.Column(db.String(200), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def course_info(self):
        return {
            "course_id": self.course_id,
            "course_name": self.course_name,
            "created_at": self.created_at.isoformat(),
        }


# -------------------- Assessment --------------------
class Assessment(db.Model):
    __tablename__ = "assessments"

    assessment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("user_data.user_id"), nullable=False
    )
    is_first_year = db.Column(db.Boolean, nullable=False, default=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.course_id"), nullable=True)
    data_set_id = db.Column(
        db.Integer, db.ForeignKey("data_set.data_set_id"), nullable=False
    )
    progress = db.Column(db.Float, nullable=False, default=0.0)  # % completed
    completed = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def assessment_info(self):
        return {
            "assessment_id": self.assessment_id,
            "user_id": self.user_id,
            "is_first_year": self.is_first_year,
            "course_id": self.course_id,
            "data_set_id": self.data_set_id,
            "progress": self.progress,
            "completed": self.completed,
            "created_at": self.created_at.isoformat(),
        }

class Answer(db.Model):
    __tablename__ = "answers"

    answer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey("assessments.assessment_id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.question_id"), nullable=False)
    answer_value = db.Column(db.Integer, nullable=False)  # scale 1-5
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    assessment = db.relationship("Assessment", backref="answers", cascade="all, delete-orphan")
    question = db.relationship("Question", backref="answers", cascade="all, delete-orphan")

    def answer_info(self):
        return {
            "answer_id": self.answer_id,
            "assessment_id": self.assessment_id,
            "question_id": self.question_id,
            "answer_value": self.answer_value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }