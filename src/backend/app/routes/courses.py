from flask import Blueprint, request, jsonify
from app import db
from app.models import Course
from sqlalchemy.exc import SQLAlchemyError

courses_bp = Blueprint("courses", __name__)

# Get all courses
@courses_bp.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([c.course_info() for c in courses]), 200

# Add a new course
@courses_bp.route("/courses", methods=["POST"])
def create_course():
    try:
        data = request.get_json()
        new_course = Course(course_name=data["course_name"])
        db.session.add(new_course)
        db.session.commit()
        return jsonify(new_course.course_info()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Delete a course
@courses_bp.route("/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    try:
        db.session.delete(course)
        db.session.commit()
        return jsonify({"message": f"Course {course_id} deleted"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
