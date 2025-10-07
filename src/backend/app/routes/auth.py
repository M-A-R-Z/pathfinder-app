from flask import Blueprint, request, jsonify, session, make_response
from ..models import User
from argon2 import PasswordHasher
from datetime import datetime, timedelta
from app.services.verify_email import verify_email
from .. import db

auth_bp = Blueprint("login", __name__)
ph = PasswordHasher()
OTP_EXPIRY = 300      
RESEND_COOLDOWN = 60  

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
        "birthday": birthday.isoformat(),
        "otp": otp,
        "otp_expiry": (datetime.utcnow() + timedelta(seconds=OTP_EXPIRY)).isoformat(),
        "last_sent": datetime.utcnow().isoformat()
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

    signup_data = session.get("pending_signup")
    if not otp or not signup_data:
        return jsonify({"success": False, "message": "No signup session found"}), 400

    # Expiry check
    expiry = datetime.fromisoformat(signup_data["otp_expiry"])
    if datetime.utcnow() > expiry:
        return jsonify({"success": False, "message": "OTP expired"}), 400

    if str(signup_data["otp"]) != str(otp):
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

    session.pop("pending_signup", None)
    return jsonify({"success": True, "message": "Email verified, user created successfully"}), 201


@auth_bp.route("/signup/resend-otp", methods=["POST"])
def resend_signup_otp():
    signup_data = session.get("pending_signup")
    if not signup_data:
        return jsonify({"success": False, "message": "No signup session found"}), 400

    last_sent = datetime.fromisoformat(signup_data["last_sent"])
    if datetime.utcnow() < last_sent + timedelta(seconds=RESEND_COOLDOWN):
        wait_time = (last_sent + timedelta(seconds=RESEND_COOLDOWN)) - datetime.utcnow()
        return jsonify({"success": False, "message": f"Please wait {int(wait_time.total_seconds())}s before resending."}), 429

    # Generate new OTP
    otp = verify_email(signup_data["email"])
    if not otp:
        return jsonify({"success": False, "message": "Error resending OTP"}), 500

    signup_data["otp"] = otp
    signup_data["otp_expiry"] = (datetime.utcnow() + timedelta(seconds=OTP_EXPIRY)).isoformat()
    signup_data["last_sent"] = datetime.utcnow().isoformat()
    session["pending_signup"] = signup_data

    return jsonify({"success": True, "message": "New OTP sent to email"}), 200

@auth_bp.route("/request-otp", methods=["POST"])
def request_otp():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    otp = verify_email(email)
    if not otp:
        return jsonify({"success": False, "message": "Error sending OTP email"}), 500

    session["password_reset_otp"] = otp
    session["password_reset_email"] = email

    return jsonify({"success": True, "message": "OTP sent to email"}), 200

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    otp = data.get("otp")
    new_password = data.get("newPassword")

    if not otp or not new_password:
        return jsonify({"success": False, "message": "OTP and new password are required"}), 400

    # Check session
    if "password_reset_otp" not in session or "password_reset_email" not in session:
        return jsonify({"success": False, "message": "No password reset session found"}), 400

    if str(session["password_reset_otp"]) != str(otp):
        return jsonify({"success": False, "message": "Invalid OTP"}), 400

    # Update user password
    user = User.query.filter_by(email=session["password_reset_email"]).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    hashed_password = ph.hash(new_password)
    user.password = hashed_password
    db.session.commit()

    # Clear session
    session.pop("password_reset_otp", None)
    session.pop("password_reset_email", None)

    return jsonify({"success": True, "message": "Password reset successfully"}), 200

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    print("/me hit")
    print(session)
    try:
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Not logged in"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user.user_info()), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get current user: {str(e)}"}), 500