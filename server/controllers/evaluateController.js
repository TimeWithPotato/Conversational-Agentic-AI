//evaluateController.js
const { model_url } = require('./modelUrl');

const evaluateController = async (req, res) => {
  const QnaHistory = req.body;
  console.log("From evaluate Controller: ", QnaHistory);

  try {
    const response = await fetch(`${model_url}/api/evaluate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(QnaHistory),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Model server error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // Correctly parse JSON from fetch response
    const data = await response.json();

    console.log("📤 Evaluation response from model server:", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Evaluation controller error:", error.message);
    res.status(500).json({
      error: "Failed to evaluate interview performance",
      details: error.message,
    });
  }
};


module.exports = { evaluateController };
