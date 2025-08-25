const { connectDB } = require("./mongoClient");

async function createInterviewer(req, res) {
  try {
    console.log(req.body);
    let db = await connectDB();
    const { name, _id } = req.body;

    if (!_id || !name) {
      return res.status(400).json({ error: "Missing _id or name" });
    }

    const existing = await db.collection("interviewers").findOne({ _id });
    if (existing) {
      return res.status(200).json({ message: "Interviewer already exists" });
    }

    await db.collection("interviewers").insertOne({ _id, name });

    return res.status(201).json({ message: "Interviewer created successfully" });
  } catch (err) {
    console.error("Error creating interviewer:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createInterviewer };
