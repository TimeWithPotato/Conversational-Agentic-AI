// index.js
const express = require("express");
const cors = require("cors");

const pdfRoutes = require("./routes/pdfRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const evaluateRoute = require("./routes/evaluateRoute");
const createInterviewer = require("./routes/createInterviewerRoute");
const createInterview = require("./routes/createInterviewRoute");
const storeQnaForGuestInterviewee = require("./routes/storeQnaForGuestIntervieweeRoute");
const getIntervieweesRoute = require("./routes/getIntervieweesRoute");
const sendInterviewEmailRoute = require("./routes/sendInterviewEmailRoute");
const getEvaluationByIntervieweeIdRoute = require("./routes/getEvaluationByIntervieweeIdRoute")
const PORT = process.env.PORT || 5000; 
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", pdfRoutes);            // POST /api/upload-pdf
app.use("/api", interviewRoutes);
app.use("/api", evaluateRoute); // evaluate route
app.use("/api", createInterviewer);
app.use("/api", createInterview);
app.use("/api", storeQnaForGuestInterviewee);
app.use("/api", sendInterviewEmailRoute);
app.use("/api", getIntervieweesRoute);
app.use("/api", getEvaluationByIntervieweeIdRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

