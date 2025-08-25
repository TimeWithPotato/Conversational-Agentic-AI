// createInterviewerRoute.js

const express = require("express");
const { createInterviewer } = require("../db/createInterviewer")

const router = express.Router();
router.post('/createInterviewer', createInterviewer);
module.exports = router;
