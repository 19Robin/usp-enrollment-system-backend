const express = require('express');
const router = express.Router();
const { getRulesFromMicroservice, updateRules, checkHold} = require('../Controller/microserviceController');
const auth = require("../Middleware/JWT/authenticateJWT");

router.get('/rules', getRulesFromMicroservice);
router.post('/rules', updateRules);
router.get('/check-hold', auth, checkHold);

module.exports = router;
