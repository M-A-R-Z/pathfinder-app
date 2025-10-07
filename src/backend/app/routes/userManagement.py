from flask import Blueprint, request, jsonify
from ..models import User
from app import db
from app.services.jwt_utils import token_required

userManagement_bp = Blueprint("user-management", __name__)


# GET CURRENT USER PROFILE
@userManagement_bp.route("/profile", methods=["GET"])
@token_required
def get_profile(payload):
    try:
        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user.user_info()), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch profile: {str(e)}"}), 500


# UPDATE CURRENT USER PROFILE
@userManagement_bp.route("/profile/update", methods=["PUT"])
@token_required
def update_profile(payload):
    try:
        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json()
        user = User.query.get(user_id)
        print(user)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Only update editable fields
        user.first_name = data.get("first_name", user.first_name)
        user.middle_name = data.get("middle_name", user.middle_name)
        user.last_name = data.get("last_name", user.last_name)
        user.affix = data.get("affix", user.affix)
        user.birthday = data.get("birthday", user.birthday)

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500
