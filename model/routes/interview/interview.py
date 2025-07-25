from flask import Blueprint, request, jsonify
from llm_models.deepseek_v3_turbo.interviewer import interviewer

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/interview', methods=['POST'])
def interview():
    try:
        data = request.json
        print(f"📥 Incoming message: {data}")
        
        resume = data.get('resume')
        history = data.get('history', [])

        # Run LLM-based interviewer function
        results = interviewer(resume, history)

        print("🖨️ LLM JSON Output:", results)

        # ✅ If it's already a Python dict, just jsonify and return
        return jsonify(results)
    
    except Exception as e:
        print("❌ Unexpected model server error:", str(e))
        return jsonify({
            "error": "Unexpected model server error",
            "exception": str(e)
        }), 500
