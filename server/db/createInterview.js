const { connectDB } = require("./mongoClient");

async function createInterview(req, res) {
  try {
    console.log("From createInterview", req.body);

    const db = await connectDB();
    const { interviewerId, intervieweeId, intervieweeName, startTime } =
      req.body;

    if (!interviewerId || !intervieweeId || !startTime) {
      return res
        .status(400)
        .json({ error: "Missing intervieweeId/interviewerId/startTime" });
    }

    const interview = {
      _id: intervieweeId, // unique id for this interview
      interviewerId,
      intervieweeId,
      intervieweeName,
      createdAt: startTime,
      endTime: "",
      qna: [],
    };

    try {
      await db.collection("interview").insertOne(interview);

      return res.status(201).json({
        message: "Interview created successfully",
      });
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key error from MongoDB
        const existingInterview = await db
          .collection("interview")
          .findOne({ interviewerId, intervieweeId });

        return res.status(409).json({
          error: "Interview already exists",
          interviewId: existingInterview?._id,
        });
      }

      throw err; // unknown error
    }
  } catch (err) {
    console.error("Error from createInterview: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createInterview };
