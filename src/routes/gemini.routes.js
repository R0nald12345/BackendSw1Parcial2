// routes/gemini.routes.js
const { Router } = require('express');
const { generarContenidoGemini } = require('../controllers/gemini.controllers.js');
const router = Router();

router.post('/', generarContenidoGemini);

module.exports = router;
