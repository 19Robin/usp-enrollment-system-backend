const express = require('express');
const router = express.Router();
const { getRulesFromMicroservice, updateRules} = require('../Controller/microserviceController');

router.get('/rules', getRulesFromMicroservice);
router.post('/rules', updateRules);

module.exports = router;
