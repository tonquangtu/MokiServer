const loginController = require('../controllers/login-controller');
const express = require('express');

// const { express } = global;
const router = express.Router();

router.post('/login', loginController.login);

module.exports = router;
