// interviewRoutes.js
const express = require('express')
const { interview } = require('../controllers/interviewController')

const router = express.Router()
router.post('/interview', interview)

module.exports = router;