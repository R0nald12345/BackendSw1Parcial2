const express = require('express');
const router = express.Router();
const {
    createProject,
    getMyProjects,
    getProjectDetails,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { auth } = require('../middlewares/auth');
const { validateProject, handleValidationErrors } = require('../middlewares/validation');

router.post('/', auth, validateProject, handleValidationErrors, createProject);
router.get('/', auth, getMyProjects);
router.get('/:id', auth, getProjectDetails);
router.put('/:id', auth, validateProject, handleValidationErrors, updateProject);
router.delete('/:id', auth, deleteProject);

module.exports = router;