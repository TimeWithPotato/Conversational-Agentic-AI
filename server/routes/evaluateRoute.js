//evaluateRoute.js
const express = require('express');
const { evaluateController } = require('../controllers/evaluateController');

const router = express.Router();
router.post('/evaluate', evaluateController);

module.exports = router;
