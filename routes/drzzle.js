const express = require('express');
const router = express.Router();
const quotes = require('../services/drzzle');

router.get('/', async function(req, res, next) {
  try {
    const result = await quotes.getMultiple(req.query.page);
    res.json({
      code: 200,
      data: result
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({'message': err.message});
  }
});