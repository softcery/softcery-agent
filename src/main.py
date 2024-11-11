from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
from config import API_PORT, API_ORIGINS

app = Flask(__name__)

app.register_blueprint(api_bp, url_prefix='/api')
CORS(app, origins=API_ORIGINS)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=API_PORT)