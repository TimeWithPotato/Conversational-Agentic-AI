// getEvaluationByIntervieweeIdRoute.js

const express = require("express");
const { getEvaluationByIntervieweeId } = require("../db/getEvaluationByIntervieweeId");

const router = express.Router();

router.get("/getEvaluationByIntervieweeId/:intervieweeId", getEvaluationByIntervieweeId);
console.log("✅ getEvaluationByIntervieweeId route loaded");
module.exports = router;