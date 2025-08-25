const { connectDB } = require("./mongoClient"); // Adjust path as needed
const { model_url } = require("../controllers/modelUrl"); // Your model server URL

const getEvaluationByIntervieweeId = async (req, res) => {
  const intervieweeId = req.params.intervieweeId;
  const isGuestJoin = req.query.isGuestJoin === "true";

  console.log(
    "Hit: getEvaluationByIntervieweeId called with ID:",
    intervieweeId
  );
  try {
    const db = await connectDB();

    // 1. Check if evaluation already exists
    const existingEvaluation = await db
      .collection("evaluation")
      .findOne({ _id: intervieweeId });

    if (existingEvaluation) {
      console.log("✅ Evaluation found in DB, returning it...");
      if (isGuestJoin) {
        return res
          .status(200)
          .json({ feedback: existingEvaluation.feedback || [] });
      }
      return res.status(200).json(existingEvaluation);
    }

    // 2. Fetch interview document
    const interview = await db
      .collection("interview")
      .findOne({ intervieweeId });

    // ✅ Validate interview and QnA
    if (
      !interview ||
      !Array.isArray(interview.qna) ||
      interview.qna.length === 0
    ) {
      console.log("⚠️ No QnA data found for this interviewee.");
      return res.status(200).json({
        _id: intervieweeId,
        intervieweeName: interview?.intervieweeName || "Unknown",
        grammar_score: 0,
        verbal_delivery: 0,
        correct_answers: 0,
        overall_score: 0,
        feedback: ["No QnA data to evaluate"],
      });
    }

    const qnaData = interview.qna;

    // 3. Send QnA to model server for evaluation
    const response = await fetch(`${model_url}/api/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qnaData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Model server error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const evaluationResult = await response.json();
    evaluationResult._id = intervieweeId; // Set _id for MongoDB
    evaluationResult.intervieweeName = interview.intervieweeName || "Unknown";

    // 4. Save evaluation result to DB
    await db.collection("evaluation").insertOne(evaluationResult);
    console.log("✅ Evaluation saved to DB");

    // 5. if guest interviewee
    if (isGuestJoin) {
      return res
        .status(200)
        .json({ feedback: evaluationResult.feedback || [] });
    }
    // 6. Send back response
    return res.status(200).json(evaluationResult);
  } catch (error) {
    console.error("❌ Error in evaluation route:", error.message);
    return res.status(500).json({
      error: "Internal server error during evaluation",
      details: error.message,
    });
  }
};

module.exports = { getEvaluationByIntervieweeId };
