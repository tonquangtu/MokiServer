const express = require('express');
const userController = require('../controllers/user-controller');

const { auth } = global;

const router = express.Router();

// authenticate route
router.post('/user-detail', auth.jwtAuthenticate(), userController.userDetail);

module.exports = router;
