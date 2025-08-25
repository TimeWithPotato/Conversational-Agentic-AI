// getIntervieweesRoute.js

const express = require("express");
const { getInterviewees } = require("../db/getInterviewees");


console.log("Hit getIntervieweesRoute.js");
const router = express.Router();
router.get("/getInterviewees", getInterviewees);
module.exports = router;