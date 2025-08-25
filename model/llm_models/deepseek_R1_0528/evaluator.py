import os
import json
import requests
import re
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

headers = {
    "Authorization": f"Bearer {HF_API_TOKEN}",
    "Content-Type": "application/json"
}

PROMPT_PATH = os.path.join(os.path.dirname(__file__), "../../prompts/evaluation.txt")
def extract_json(text):
    try:
        text = text.strip()

        # Match a valid JSON block from { ... } including newlines
        match = re.search(r'{[\s\S]*}', text)
        if not match:
            raise ValueError("No valid JSON object found in the text.")

        json_str = match.group(0)
        return json.loads(json_str)
    
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON decoding failed: {e}")
    except Exception as e:
        raise ValueError(f"Failed to extract JSON: {e}")


def evaluator(qnaHistory):
    with open(PROMPT_PATH, "r") as f:
        prompt_template = f.read()
        print(prompt_template)
    
    filled_prompt = prompt_template.format(history=qnaHistory)
    print("📜 Evaluation Prompt:\n", filled_prompt)

    payload = {
        "messages": [
            {
                "role": "user",
                "content": filled_prompt
            }
        ],
        "model": "deepseek-ai/DeepSeek-V3-0324:novita"
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        print("📩 Hugging Face response:", response)

        if response.status_code != 200:
            raise RuntimeError(f"❌ Hugging Face error {response.status_code}:{response.text}")
        
        result = response.json()

        raw_output = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        print(f"🖨️ Raw Output from LLM:\n{raw_output}\nType: {type(raw_output)}")

        try:
            parsed_json = extract_json(raw_output)
            print("🖨️ Parsed JSON:", parsed_json, "\nand type:", type(parsed_json))
            return parsed_json

        except ValueError as ve:
            with open("bad_llm_output.txt", "w", encoding="utf-8") as f:
                f.write(raw_output)

            raise RuntimeError(
                f"❌ Invalid JSON from LLM\n\nRaw output: {raw_output}\n\nError: {ve}"
            )

    except Exception as e:
        raise RuntimeError(f"❌ Evaluation request failed: {e}")


