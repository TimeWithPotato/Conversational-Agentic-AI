from flask import Blueprint, request, jsonify
from llm_models.deepseek_R1_0528.evaluator import evaluator

evaluate_bp = Blueprint('evaluate',__name__)

@evaluate_bp.route('/evaluate', methods=['POST'])

def evaluate_route():
    try:
        data = request.json
        print(f"📥 Incoming qnaHistory: {data}")
        results = evaluator(data)
        print("🖨️ LLM JSON Output:", results)

        return jsonify(results)
    except Exception as e:
        print("❌ Unexpected model server error:", str(e))
        return jsonify({
            "error": "Unexpected model server error",
            "exception": str(e)
        }), 500