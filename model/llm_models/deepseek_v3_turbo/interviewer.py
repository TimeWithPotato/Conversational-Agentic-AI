from cmd import PROMPT
import json
import requests
import re
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions"
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

headers = {
    "Authorization": f"Bearer {HF_API_TOKEN}",
    "Content-Type": "application/json"
}

PROMPT_PATH = os.path.join(os.path.dirname(__file__), "../../prompts/interview.txt")

def extract_json(text):
    try:
        start = text.find('{')
        if start == -1:
            raise ValueError("No opening '{' found")

        # Track braces to extract full JSON object
        brace_count = 0
        for i in range(start, len(text)):
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1

            if brace_count == 0:
                json_str = text[start:i+1]
                return json.loads(json_str)

        raise ValueError("Braces did not match; no valid JSON object found.")

    except Exception as e:
        raise ValueError(f"Failed to extract JSON: {e}")


def interviewer(resume, history):
    with open(PROMPT_PATH, 'r') as f:
        prompt_template = f.read()

    filled_prompt = prompt_template.format(resume=resume, history=history)
    print("🧠 Prompt:\n", filled_prompt)

    payload = {
    "messages": [
        {
            "role": "user",
            "content": filled_prompt
        }
    ],
    "model": "deepseek/deepseek-v3-turbo"
}

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        print("📩 Hugging Face response:", response)

        if response.status_code != 200:
            raise RuntimeError(f"❌ Hugging Face error {response.status_code}: {response.text}")

        result = response.json()

        if "choices" in result and result["choices"]:
            raw_output = result["choices"][0]["message"]["content"]
            print(f"🖨️ raw output {raw_output}\n and it's type {type(raw_output)}")

            parsed_json = extract_json(raw_output)
            print("🖨️ Parsed JSON:", parsed_json)

            return parsed_json 

        raise RuntimeError(f"❌ Unexpected HF response format: {result}")

    except requests.Timeout:
        raise RuntimeError("Model timed out.")
    except requests.RequestException as e:
        raise RuntimeError(f"Hugging Face API error: {e}")
    except ValueError as e:
        raise RuntimeError(f"❌ Invalid JSON from LLM\n\nRaw output: {raw_output}\n\nError: {e}")
