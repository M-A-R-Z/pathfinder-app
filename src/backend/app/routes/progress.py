from flask import Blueprint, jsonify, request
from app.models import Assessment
from app import db

progress_bp = Blueprint("progress", __name__, url_prefix="/api/progress")

# GET progress for a specific user + dataset
@progress_bp.route("/<int:user_id>/<int:data_set_id>", methods=["GET"])
def get_progress(user_id, data_set_id):
    assessment = Assessment.query.filter_by(user_id=user_id, data_set_id=data_set_id).first()
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    return jsonify(assessment.assessment_info())


# UPDATE progress for a specific user + dataset
@progress_bp.route("/<int:user_id>/<int:data_set_id>", methods=["POST"])
def update_progress(user_id, data_set_id):
    data = request.get_json()
    new_progress = data.get("progress")

    if new_progress is None:
        return jsonify({"error": "Missing progress value"}), 400

    assessment = Assessment.query.filter_by(user_id=user_id, data_set_id=data_set_id).first()
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    assessment.progress = float(new_progress)
    assessment.completed = assessment.progress >= 100.0
    db.session.commit()

    return jsonify({
        "message": "Progress updated",
        "assessment": assessment.assessment_info()
    })
