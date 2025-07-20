const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('Nombre es requerido')
];

const validateLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Password es requerido')
];

const validateProject = [
    body('nombre').notEmpty().withMessage('Nombre del proyecto es requerido'),
    body('descripcion').optional()
];

const validateInvite = [
    body('email').isEmail().withMessage('Email inválido'),
    body('proyectoId').isInt().withMessage('ID de proyecto inválido')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProject,
    validateInvite,
    handleValidationErrors
};