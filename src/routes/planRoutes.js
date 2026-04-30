const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

router.post('/generar', planController.generarPlan);

module.exports = router;