const express = require("express");
const multer = require("multer");
const { extractPdfText } = require("../controllers/pdfController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-pdf", upload.single("file"), extractPdfText);

module.exports = router;
