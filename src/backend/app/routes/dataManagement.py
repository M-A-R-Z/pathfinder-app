from flask import Blueprint, request, jsonify
from app import db
from app.models import DataSet, Data, Question, QuestionSet
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd

dataset_bp = Blueprint("datasets", __name__)


# Get all datasets
@dataset_bp.route("/datasets", methods=["GET"])
def get_datasets():
    try:
        datasets = DataSet.query.all()
        response = []
        for ds in datasets:
            print("Loaded dataset:", ds)  # debug
            rows_count = Data.query.filter_by(data_set_id=ds.data_set_id).count()
            print("Rows count:", rows_count)
            print("DataSet info:", ds.data_set_info())  # <- likely crashes here
            response.append({
                **ds.data_set_info(),
                "rows": rows_count
            })
        return jsonify(response), 200
    except Exception as e:  # catch everything
        print("❌ ERROR in /datasets:", str(e))
        return jsonify({"error": str(e)}), 500


#Get question set though dataset
@dataset_bp.route("/active-dataset", methods=["GET"])
def get_active_dataset():
    active_set = DataSet.query.filter_by(status="Active").first()
    if not active_set:
        return jsonify({"error": "No active dataset found"}), 404

    # include question_set info directly (optional, but handy for client)
    return jsonify({
        **active_set.data_set_info(),
        "question_set": {
            "question_set_id": active_set.question_set.question_set_id,
            "question_set_name": active_set.question_set.question_set_name,
        }
    }), 200
@dataset_bp.route("/datasets/<int:data_set_id>/records", methods=["GET"])
def get_dataset_records(data_set_id):
    try:
        records = Data.query.filter_by(data_set_id=data_set_id).all()
        return jsonify([r.data_info() for r in records]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    
