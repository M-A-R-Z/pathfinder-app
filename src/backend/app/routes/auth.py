from flask import Blueprint, request, jsonify, session, make_response
from ..models import User
from argon2 import PasswordHasher
from datetime import datetime
from app.services.verify_email import verify_email
from .. import db

auth_bp = Blueprint("login", __name__)
ph = PasswordHasher()

@auth_bp.route("/login", methods=["POST"])
def login():
    print(session)
    session.clear()
    print("Login endpoint hit")
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    remember = data.get("remember", False)

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400
    print(email, password)
    
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"success": False, "message": "User not found"}), 404

    try:
        ph.verify(user.password, password)
    except Exception:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    session["user_id"] = user.user_id
    print(session)
    session.permanent = remember
    return jsonify({
        "success": True,
        "redirect": "/"
    }), 200

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    middle_name = data.get("middle_name", "")
    affix = data.get("affix", "")
    birthday = data.get("birthday")
    confirmPassword = data.get("confirmPassword")

    if not all([email, password, first_name, last_name, birthday, confirmPassword]):
        return jsonify({"success": False, "message": "All fields are required"}), 400
    if password != confirmPassword:
        return jsonify({"success": False, "message": "Passwords do not match"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already registered"}), 400

    hashed_password = ph.hash(password)
    birthday = datetime.strptime(birthday, "%Y-%m-%d").date()

    # Generate OTP
    otp = verify_email(email)
    if not otp:
        return jsonify({"success": False, "message": "Error sending verification email"}), 500

    # Temporarily store user data + OTP in session
    session["pending_signup"] = {
        "email": email,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "middle_name": middle_name,
        "affix": affix,
        "birthday": birthday.isoformat()
    }
    session["pending_otp"] = otp

    return jsonify({"success": True, "message": "OTP sent to email"}), 200

    
@auth_bp.route("/check-session")
def check_session():
    print(session)
    if "user_id" in session:
        return jsonify({"logged_in": True, "user": session["user_id"]})
    else:
        return jsonify({"logged_in": False}), 401
    
@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    
    resp = make_response(jsonify({"success": True, "redirect": "/"}))

    resp.delete_cookie("session")
    session.permanent = False
    return resp, 200

@auth_bp.route("/verify-email", methods=["POST"])
def verify_email_code():
    data = request.get_json()
    otp = data.get("otp")

    if not otp or "pending_signup" not in session:
        return jsonify({"success": False, "message": "No signup session found"}), 400

    if str(session.get("pending_otp")) != str(otp):
        return jsonify({"success": False, "message": "Invalid OTP"}), 400

    # OTP is correct → create user
    signup_data = session["pending_signup"]
    new_user = User(
        email=signup_data["email"],
        password=signup_data["password"],
        first_name=signup_data["first_name"],
        last_name=signup_data["last_name"],
        middle_name=signup_data["middle_name"],
        affix=signup_data["affix"],
        birthday=datetime.strptime(signup_data["birthday"], "%Y-%m-%d").date(),
        role="USER"
    )

    db.session.add(new_user)
    db.session.commit()

    # Clear session
    session.pop("pending_signup", None)
    session.pop("pending_otp", None)

    return jsonify({"success": True, "message": "Email verified, user created successfully"}), 201
