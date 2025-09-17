from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config
import os



db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    app.config.from_object(Config)
    db.init_app(app)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    


    return app
