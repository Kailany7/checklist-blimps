const express = require('express');
const router = express.Router();
const controller = require('../controllers/checklistController');

router.get('/', controller.getAll);
router.patch('/reset', controller.reset);
router.patch('/:id', controller.update);
router.post('/seed', controller.seed);

module.exports = router;