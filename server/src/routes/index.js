const express = require('express');
const { getExampleData } = require('../controllers/index'); // Ensure path is correct

const router = express.Router();

router.get('/example', getExampleData);

module.exports = router; // Export the router
