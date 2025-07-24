const express = require('express');
const router = express.Router();
const { inviteUser, removeUser } = require('../controllers/inviteController');
const { auth } = require('../middlewares/auth');
const { validateInvite, handleValidationErrors } = require('../middlewares/validation');

router.post('/', auth, validateInvite, handleValidationErrors, inviteUser);
router.delete('/:proyectoId/users/:usuarioId', auth, removeUser);

module.exports = router;