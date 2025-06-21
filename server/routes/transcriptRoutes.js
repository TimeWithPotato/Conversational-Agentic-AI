const express = require("express");
const { handleTranscript, welcome } = require("../controllers/transcriptController");

const router = express.Router();

router.get("/", welcome);
router.post("/transcript", handleTranscript);

module.exports = router;
