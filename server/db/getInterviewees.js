// getInterviewees.js
const { connectDB } = require("./mongoClient");

const getInterviewees = async (req, res) => {

  console.log("Server hit on getInterviewees.js");
  try {
    const db = await connectDB();
    const interviewees = await db
      .collection("interview")
      .find(
        {},
        {
          projection: {
            _id: 1,
            intervieweeName: 1,
            intervieweeId: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    console.log("From getInterviewees:\n");
    interviewees.forEach((item) => {
      console.log(
        `Name: ${item.intervieweeName}, IntervieweID: ${item.intervieweeId}`
      );
    });

    res.status(200).json(interviewees);
  } catch (err) {
    console.error("Error fetching interviewees:", err);
    res.status(500).json({ error: "Failed to fetch interviewees" });
  }
};

module.exports = { getInterviewees };
