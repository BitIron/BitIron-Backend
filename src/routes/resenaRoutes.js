const express = require('express');
const router = express.Router();
const { crearResena } = require('../controllers/resenaController');

router.post('/', crearResena);

module.exports = router;