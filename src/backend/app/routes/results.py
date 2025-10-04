# app/routes/results.py
from flask import Blueprint, jsonify
from app import db
from app.models import Results, Neighbors, Assessment, DataSet

results_bp = Blueprint("results", __name__)

# ----- GET Assessment Results -----
@results_bp.route("/results/<int:assessment_id>", methods=["GET"])
def get_results(assessment_id):
    # Check if assessment exists
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    if not assessment.completed:
        return jsonify({"error": "Results are locked until the assessment is completed"}), 403

    # Fetch results
    # inside get_results
    result = Results.query.filter_by(assessment_id=assessment.assessment_id).first()
    if not result:
        return jsonify({"error": "Results not found"}), 404

    # fetch dataset
    dataset = DataSet.query.get(assessment.data_set_id)

    return jsonify({
        "results_id": result.results_id,
        "recommended_strand": result.recommended_strand,
        "stem_score": result.stem_score,
        "humss_score": result.humss_score,
        "abm_score": result.abm_score,
        "recommendation_description": result.recommendation_description,  # <- include description too
        "dataset_name": dataset.data_set_name if dataset else None,
        "created_at": result.created_at.isoformat() if result.created_at else None,  # ✅ added
        "neighbors": [
            {
                "neighbor_index": n.neighbor_index,
                "strand": n.strand,
                "distance": float(n.distance) if n.distance else None
            } for n in result.neighbors
        ],
        "tie_info": {
            "stem_weight": result.tie_table.stem_weight,
            "humss_weight": result.tie_table.humss_weight,
            "abm_weight": result.tie_table.abm_weight
        } if result.tie_table else None
    }), 200


# ----- GET Neighbors for Assessment -----
@results_bp.route("/results/<int:assessment_id>/neighbors", methods=["GET"])
def get_neighbors(assessment_id):
    # Find results entry first
    result = Results.query.filter_by(assessment_id=assessment_id).first()
    if not result:
        return jsonify({"error": "Results not found"}), 404

    # Fetch neighbors
    neighbors = Neighbors.query.filter_by(results_id=result.results_id).all()
    if not neighbors:
        return jsonify([]), 200  # empty list

    neighbors_data = [
        {
            "neighbors_id": n.neighbors_id,
            "neighbor_index": n.neighbor_index,
            "strand": n.strand,
            "distance": float(n.distance) if n.distance else None,
        }
        for n in neighbors
    ]

    return jsonify(neighbors_data), 200
