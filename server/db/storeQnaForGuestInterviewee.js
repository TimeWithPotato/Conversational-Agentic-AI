const { connectDB } = require("./mongoClient");

async function storeQnaForGuestInterviewee(req, res) {
  try {
    console.log("From storeQnaForGuestInterviewee: ", req.body);
    let db = await connectDB();
    const { interviewerId, intervieweeId, startTime, endTime, qna } = req.body;

    if (!intervieweeId || !interviewerId || !qna) {
      return res
        .status(400)
        .json({ error: "Missing intervieweeId/interviewerId/qna" });
    }

    const filter = { _id: intervieweeId };
    const result = await db.collection("interview").updateOne(filter, {
      $set: {
        endTime: endTime || new Date(),
        qna: qna,
      },
    });

    if (result.matchedCount == 0)
      return res.status(404).json({ error: "Interview not found" });

    return res.status(200).json({ message: "Interview updated successfully" });
  } catch (err) {
    console.error("Error from storeQnaForGuestInterviewee: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { storeQnaForGuestInterviewee };
