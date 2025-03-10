const express = require('express');
const   router = express.Router();
const scriptController = require('../controllers/scriptController');
const auth = require('../middleware/auth');

router.get('/', auth, scriptController.getScripts);

router.post('/', auth, scriptController.createScript);

router.delete('/:id', auth, scriptController.deleteScript);

module.exports = router;