const express = require("express");
const cors = require("cors");

const pdfRoutes = require("./routes/pdfRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", pdfRoutes);            // POST /api/upload-pdf
app.use("/", transcriptRoutes);        // GET / & POST /transcript

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
