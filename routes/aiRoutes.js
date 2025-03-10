const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/generate', auth, aiController.generateScript);

// router.get('/test-models', auth, aiController.listAndTestModels);

// router.get('/model-capabilities', auth, aiController.getModelCapabilities);

module.exports = router;