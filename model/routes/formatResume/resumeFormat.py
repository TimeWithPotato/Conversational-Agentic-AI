from flask import Blueprint, request, jsonify
from llm_models.meta_llama_3_70B_Instruct.resumeFormatter import resumeFormatter

formatter_bp = Blueprint("format-resume",__name__)

@formatter_bp.route('/format-resume', methods=['POST'])
def resumeFormat():
    try:
        data = request.json
        print(f"📥 Incoming message: {data}")

        resume = data.get("resume")

        results = resumeFormatter(resume)

        print("🖨️ LLM JSON Output:", results)

                # ✅ If it's already a Python dict, just jsonify and return
        return jsonify(results)
    
    except Exception as e:
        print("❌ Unexpected model server error:", str(e))
        return jsonify({
            "error": "Unexpected model server error",
            "exception": str(e)
        }), 500