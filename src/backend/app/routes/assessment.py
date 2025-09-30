# app/routes/assessment.py
from flask import Blueprint, request, jsonify
from app import db
from app.models import Assessment

assessment_bp = Blueprint("assessment", __name__)

# Save/update progress
@assessment_bp.route("/assessment/<int:assessment_id>/progress", methods=["PUT"])
def update_progress(assessment_id):
    data = request.get_json()
    progress = data.get("progress")

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    assessment.progress = progress
    db.session.commit()

    return jsonify({
        "assessment_id": assessment.assessment_id,
        "progress": assessment.progress,
        "completed": assessment.completed
    }), 200

# Fetch saved progress
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
