const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middlewares/validation');

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', auth, getProfile);

module.exports = router;