// storeQnaForGuestIntervieweeRoute.js

const express = require("express");
const { storeQnaForGuestInterviewee } = require("../db/storeQnaForGuestInterviewee");

const router = express.Router();
router.post('/storeQnaForGuestInterviewee', storeQnaForGuestInterviewee);

module.exports = router;