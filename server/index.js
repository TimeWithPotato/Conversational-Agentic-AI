// index.js
const express = require("express");
const cors = require("cors");

const pdfRoutes = require("./routes/pdfRoutes");
const interviewRoutes = require("./routes/interviewRoutes")
const evaluateRoute = require("./routes/evaluateRoute")
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", pdfRoutes);            // POST /api/upload-pdf
app.use("/api",interviewRoutes)
app.use("/api", evaluateRoute ) // evaluate route

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
