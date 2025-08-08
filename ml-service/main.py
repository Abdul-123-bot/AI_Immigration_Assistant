# /ml-service/main.py

import os
import json
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import fitz      # PyMuPDF
import openai    # The official OpenAI library

# --- Setup ---
app = Flask(__name__)
load_dotenv()

try:
    client = openai.OpenAI()
except openai.OpenAIError as e:
    print(f"Error initializing OpenAI client: {e}")
    client = None

SYSTEM_PROMPT = """
You are an expert paralegal AI assistant. Your task is to analyze a legal document.
When given the document text, you must return a single JSON object with two keys:
1.  "summary": A string containing a concise summary in bullet points, focusing on the document's purpose, required actions, and key deadlines.
2.  "entities": A JSON object containing extracted details for "Case Number", "Petitioner Name", "Beneficiary Name", and "Deadline". Use null if a value is not found.

Do not include any other text or explanations outside of this final JSON object.
"""

# --- API Endpoint ---

@app.route("/analyze", methods=["POST"])
def analyze_document():
    """Receives a file, extracts text, and calls the OpenAI API directly."""
    if not client:
         return jsonify({"error": "OpenAI client not initialized. Check your API key."}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400

    try:
        # --- NEW: Handle different file types ---
        filename = file.filename
        document_text = ""
        
        if filename.lower().endswith('.pdf'):
            # Use PyMuPDF to extract text from a PDF
            file_bytes = file.read()
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            document_text = "".join(page.get_text() for page in doc)
        elif filename.lower().endswith('.txt'):
            # Read a plain text file directly
            document_text = file.read().decode('utf-8')
        else:
            # Return an error for unsupported file types
            return jsonify({"error": "Unsupported file type. Please upload a PDF or TXT file."}), 415

        if not document_text.strip():
            return jsonify({"error": "Could not extract text from the document."}), 400

        # --- Direct OpenAI API Call ---
        completion = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": document_text}
            ]
        )
        
        json_response_str = completion.choices[0].message.content
        analysis_result = json.loads(json_response_str)

        return jsonify(analysis_result)

    except openai.APIError as e:
        print(f"OpenAI API Error: {e}")
        return jsonify({"error": f"An error occurred with the OpenAI API: {e}"}), 502
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An internal error occurred during analysis."}), 500

# --- Run the App ---

if __name__ == "__main__":
    app.run(debug=True, port=5001)