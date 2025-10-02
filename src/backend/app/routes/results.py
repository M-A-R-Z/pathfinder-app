# app/routes/results.py
from flask import Blueprint, jsonify
from app import db
from app.models import Results, Neighbors, TieTable, Assessment

results_bp = Blueprint("results", __name__, url_prefix="/results")

@results_bp.route("/<int:assessment_id>", methods=["GET"])
def get_results(assessment_id):
    # Check if assessment exists and is completed
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    if not assessment.completed:
        return jsonify({"error": "Results are locked until the assessment is completed"}), 403

    # Fetch the result for the assessment
    result = Results.query.filter_by(assessment_id=assessment.assessment_id).first()
    if not result:
        return jsonify({"error": "Results not found"}), 404

    # Fetch neighbors
    neighbors = Neighbors.query.filter_by(results_id=result.results_id).all()
    neighbors_data = [
        {"neighbor_index": n.neighbor_index, "strand": n.strand, "distance": n.distance}
        for n in neighbors
    ]

    # Fetch tie info
    tie = TieTable.query.filter_by(results_id=result.results_id).first()
    tie_data = {
        "stem_weight": tie.stem_weight,
        "humss_weight": tie.humss_weight,
        "abm_weight": tie.abm_weight
    } if tie else None

    return jsonify({
        "results_id": result.results_id,
        "recommended_strand": result.recommended_strand,
        "stem_score": result.stem_score,
        "humss_score": result.humss_score,
        "abm_score": result.abm_score,
        "neighbors": neighbors_data,
        "tie_info": tie_data
    }), 200
