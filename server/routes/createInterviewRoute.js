// createInterviewRoute.js

const express = require("express");
const { createInterview } = require("../db/createInterview");

const router = express.Router();
router.post('/createInterview', createInterview);
module.exports = router;