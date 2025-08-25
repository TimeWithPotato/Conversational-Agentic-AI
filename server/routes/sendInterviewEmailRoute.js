// sendInterviewEmailRoute.js

const express = require("express");
const { sendInterviewEmailController } = require("../controllers/sendInterviewEmailController");
const router = express.Router();
router.post("/sendInterviewEmail", sendInterviewEmailController);

module.exports = router;