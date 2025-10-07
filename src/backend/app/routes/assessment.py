# app/routes/assessment.py
from flask import Blueprint, request, jsonify
from app import db
from app.services.jwt_utils import token_required
from app.models import (
    Assessment, Answer, Data, DataSet, Results,
    Neighbors, TieTable, Question, User
)
from app.services.KNN import KNN

assessment_bp = Blueprint("assessment", __name__)

# ---------------- Helper ----------------
def calculate_assessment_stats(assessment_id):
    """Recalculate strand totals and progress for an assessment."""
    assessment = Assessment.query.get_or_404(assessment_id)
    dataset = DataSet.query.get_or_404(assessment.data_set_id)

    # Join answers with questions
    rows = (
        db.session.query(Answer, Question)
        .join(Question, Answer.question_id == Question.question_id)
        .filter(
            Answer.assessment_id == assessment_id,
            Question.set_id == dataset.question_set_id
        )
        .all()
    )

    # Strand totals
    strand_totals = {"STEM": 0, "ABM": 0, "HUMSS": 0}
    for ans, q in rows:
        if q.strand in strand_totals:
            strand_totals[q.strand] += ans.answer_value

    # Progress
    total_questions = Question.query.filter_by(set_id=dataset.question_set_id).count()
    answered_count = len(rows)
    progress = (answered_count / total_questions) * 100 if total_questions > 0 else 0

    return {
        "strand_totals": strand_totals,
        "progress": progress,
        "answered_count": answered_count,
        "total_questions": total_questions
    }

# ---------------- Routes ----------------

# Create assessment
@assessment_bp.route("/assessments", methods=["POST"])
@token_required
def create_assessment(payload):
    user_id = payload.get("user_id")
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    data_set_id = data.get("data_set_id")
    course_id = data.get("course_id")
    is_first_year = data.get("is_first_year", True)

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


# Save or update answer
@assessment_bp.route("/assessment/<int:assessment_id>/answers", methods=["PUT"])
def save_answer(assessment_id):
    data = request.get_json()
    question_id = data.get("question_id")
    answer_value = data.get("answer")

    if not question_id or answer_value is None:
        return jsonify({"error": "Missing question_id or answer"}), 400

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    try:
        # Upsert answer
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

        db.session.flush()

        # Recalculate stats
        stats = calculate_assessment_stats(assessment_id)

        # Update assessment
        assessment.progress = stats["progress"]
        assessment.stem_total = stats["strand_totals"]["STEM"]
        assessment.abm_total = stats["strand_totals"]["ABM"]
        assessment.humss_total = stats["strand_totals"]["HUMSS"]

        db.session.commit()

        return jsonify({
            "success": True,
            "progress": assessment.progress,
            "answered_count": stats["answered_count"],
            "total_questions": stats["total_questions"],
            "strand_totals": stats["strand_totals"]
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Get saved answers
@assessment_bp.route("/assessment/<int:assessment_id>/answers", methods=["GET"])
def get_answers(assessment_id):
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    answers = Answer.query.filter_by(assessment_id=assessment_id).all()
    result = [
        {"question_id": a.question_id, "answer_value": a.answer_value}
        for a in answers
    ]
    return jsonify(result), 200


# Get progress
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


# Update progress manually
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


# Delete assessment
@assessment_bp.route("/assessment/<int:assessment_id>", methods=["DELETE", "OPTIONS"])
def delete_assessment(assessment_id):
    if request.method == "OPTIONS":
        return "", 200  # handle CORS preflight

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    # Delete all associated answers first
    Answer.query.filter_by(assessment_id=assessment_id).delete()

    # Then delete the assessment itself
    db.session.delete(assessment)
    db.session.commit()

    return jsonify({"success": True, "message": "Assessment deleted"}), 200


# Submit assessment
@assessment_bp.route("/submit_assessment/<int:assessment_id>", methods=["POST"])
def submit_assessment(assessment_id):
    try:
        assessment = Assessment.query.get_or_404(assessment_id)
        if assessment.completed:
            return jsonify({"error": "Assessment already completed"}), 400

        # Recalculate stats (authoritative source of truth)
        stats = calculate_assessment_stats(assessment_id)
        strand_totals = stats["strand_totals"]

        if stats["answered_count"] == 0:
            return jsonify({"error": "No answers found"}), 400

        # Prepare vector for KNN
        sample_answers = [
            strand_totals["STEM"],
            strand_totals["ABM"],
            strand_totals["HUMSS"]
        ]

        # Training data
        dataset_entries = Data.query.filter_by(data_set_id=assessment.data_set_id).all()
        if not dataset_entries:
            return jsonify({"error": "No training data found for dataset"}), 400

        dataset_list = [[d.stem_score, d.abm_score, d.humss_score] for d in dataset_entries]
        strand_list = [d.strand for d in dataset_entries]
        print

        # Run KNN
        knn = KNN(sample_answers, dataset_list, strand_list, assessment.data_set_id)
        results = knn.start_algorithm()

        # Save Results
        new_result = Results(
            stem_score=results["stem_score"],
            abm_score=results["abm_score"],
            humss_score=results["humss_score"],
            recommendation_description=f"Recommended strand: {results['recommendation']}",
            tie=results["tie"],
            assessment_id=assessment_id,
            recommended_strand=results["recommendation"],
        )
        db.session.add(new_result)
        db.session.flush()

        # Save neighbors
        for n in results["neighbors"]:
            neighbor = Neighbors(
                results_id=new_result.results_id,
                neighbor_index=n["neighbor_index"],
                strand=n["strand"],
                distance=n["distance"],
            )
            db.session.add(neighbor)

        # Save tie info
        if results["tie"] and results["tie_strands"]:
            tie = TieTable(
                results_id=new_result.results_id,
                stem_weight=results["tie_strands"].get("stem_weight", 0),
                humss_weight=results["tie_strands"].get("humss_weight", 0),
                abm_weight=results["tie_strands"].get("abm_weight", 0),
            )
            db.session.add(tie)

        # Mark assessment as completed and sync totals
        assessment.completed = True
        assessment.stem_total = strand_totals["STEM"]
        assessment.abm_total = strand_totals["ABM"]
        assessment.humss_total = strand_totals["HUMSS"]
        db.session.commit()

        return jsonify({
            "message": "Assessment submitted successfully",
            "results_id": new_result.results_id,
            "recommended_strand": new_result.recommended_strand,
            "neighbors": results["neighbors"],
            "tie_info": results["tie_strands"] if results["tie"] else None
        }), 200

    except Exception as e:
        import traceback
        print("Error in submit_assessment:", traceback.format_exc())
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
