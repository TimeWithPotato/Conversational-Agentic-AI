const { model_url } = require('./modelUrl');
const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractPdfText = async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: "No file uploaded" });

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    const text = data.text || "";

    const words = text.trim().split(/\s+/);
    const wordCount = words.filter(word => word.length > 0).length
    
    console.log(wordCount)

    const response = await fetch(`${model_url}/api/format-resume`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: data.text }),
    });

    const formatted_resume = await response.json();
    fs.unlinkSync(filePath); // Delete uploaded file
    console.log(formatted_resume)
    res.json(formatted_resume)
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
};

module.exports = { extractPdfText };
