# model/app.py
from flask import Flask
from routes.interview.interview import interview_bp
from routes.formatResume.resumeFormat import formatter_bp
from routes.evaluate.evaluate import evaluate_bp
app = Flask(__name__)
app.register_blueprint(interview_bp, url_prefix='/api')
app.register_blueprint(formatter_bp, url_prefix ='/api')
app.register_blueprint(evaluate_bp, url_prefix='/api')
# @app.route('/')
# def home():
#     return "🚀 Flask app is running"

if __name__ == "__main__":
    app.run(debug=True,port=5273)