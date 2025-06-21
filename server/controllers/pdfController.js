const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractPdfText = async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);
    fs.unlinkSync(filePath); 
    res.json({ text: data.text });
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
};

module.exports = { extractPdfText };
