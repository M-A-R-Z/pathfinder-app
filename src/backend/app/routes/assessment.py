# app/routes/assessment.py
from flask import Blueprint, request, jsonify, session
from app import db
from app.models import Assessment, User, Answer, Question, QuestionSet

assessment_bp = Blueprint("assessment", __name__)

# Create assessment
@assessment_bp.route("/assessments", methods=["POST"])
def create_assessment():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    data_set_id = data.get("data_set_id")
    course_id = data.get("course_id")
    is_first_year = data.get("is_first_year", True)

    # Double check user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_assessment = Assessment(
        user_id=user_id,
        is_first_year=is_first_year,
        course_id=course_id,
        data_set_id=data_set_id,
        progress=0.0,
        completed=False
    )

    db.session.add(new_assessment)
    db.session.commit()

    return jsonify(new_assessment.assessment_info()), 201


# Update progress
@assessment_bp.route("/assessment/<int:assessment_id>/progress", methods=["PUT"])
def update_progress(assessment_id):
    data = request.get_json()
    progress = data.get("progress")

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    assessment.progress = float(progress or 0.0)
    assessment.completed = assessment.progress >= 100.0
    db.session.commit()

    return jsonify({
        "assessment_id": assessment.assessment_id,
        "progress": assessment.progress,
        "completed": assessment.completed
    }), 200


# Get saved progress
@assessment_bp.route("/assessment/<int:assessment_id>/progress", methods=["GET"])
def get_progress(assessment_id):
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    return jsonify({
        "assessment_id": assessment.assessment_id,
        "progress": assessment.progress,
        "completed": assessment.completed
    }), 200

@assessment_bp.route("/assessment/<int:assessment_id>/answers", methods=["PUT"])
def save_answer(assessment_id):
    data = request.get_json()
    question_id = data.get("question_id")
    answer_value = data.get("answer")

    if not question_id or answer_value is None:
        return jsonify({"error": "Missing question_id or answer"}), 400

    # check if answer exists
    existing = Answer.query.filter_by(assessment_id=assessment_id, question_id=question_id).first()
    if existing:
        existing.answer_value = answer_value
    else:
        new_answer = Answer(
            assessment_id=assessment_id,
            question_id=question_id,
            answer_value=answer_value
        )
        db.session.add(new_answer)

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    # ✅ Add here: get dataset to fetch question_set_id
    from app.models import DataSet
    dataset = DataSet.query.get(assessment.data_set_id)
    if not dataset:
        return jsonify({"error": "Dataset not found"}), 404

    question_set_id = dataset.question_set_id

    # count total questions and answered questions
    total_questions = Question.query.filter_by(set_id=question_set_id).count()
    answered_count = Answer.query.join(Question).filter(
        Answer.assessment_id == assessment_id,
        Question.set_id == question_set_id
    ).count()

    assessment.progress = (answered_count / total_questions) * 100
    assessment.completed = assessment.progress >= 100.0
    db.session.commit()

    return jsonify({"success": True, "progress": assessment.progress})

@assessment_bp.route("/assessment/<int:assessment_id>/answers", methods=["GET"])
def get_answers(assessment_id):
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    answers = Answer.query.filter_by(assessment_id=assessment_id).all()
    result = [
        {
            "question_id": a.question_id,
            "answer_value": a.answer_value
        } for a in answers
    ]
    return jsonify(result), 200\
    
@assessment_bp.route("/assessment/<int:assessment_id>", methods=["DELETE"])
def delete_assessment(assessment_id):
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    # Delete all associated answers first
    Answer.query.filter_by(assessment_id=assessment_id).delete()

    # Then delete the assessment itself
    db.session.delete(assessment)
    db.session.commit()

    return jsonify({"success": True, "message": "Assessment deleted"}), 200