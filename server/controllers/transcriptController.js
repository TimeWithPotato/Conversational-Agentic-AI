const handleTranscript = (req, res) => {
  const { message } = req.body;
  console.log("Transcript Received:", message);

  res.json({ received: true, echo: message });
};

const welcome = (req, res) => {
  res.send("SIMPLE CONVERSATIONAL AGENTIC AI'S FIRST PHASE VOICE TO TEXT IS RUNNING");
};

module.exports = { handleTranscript, welcome };
