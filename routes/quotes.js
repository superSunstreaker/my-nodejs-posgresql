const express = require('express');
const router = express.Router();
const quotes = require('../services/quotes');

/* GET quotes listing. */
router.get('/', async function(req, res, next) {
  try {
    const result = await quotes.getMultiple(req.query.page);
    res.json({
      code: 200,
      data: {
        list: result.data,
        total: result.total,
        page: result.meta.page,
      }
    })
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    res.status(err.statusCode || 500).json({'message': err.message});
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({message: 'Invalid ID'});
      return;
    }
    const result = await quotes.getById(id);
    if (result) {
      res.json({code: 200, data: result});
    } else {
      res.status(404).json({message: 'Quote not found'});
    }
  } catch (err) {
    console.error(`Error while getting quote by ID `, err.message);
    res.status(err.statusCode || 500).json({'message': err.message});
  }
});

/* POST quotes */
router.post('/', async function(req, res, next) {
  try {
    res.json({code: 200, ...await quotes.create(req.body)});
  } catch (err) {
    console.error(`Error while posting quotes `, err.message);
    res.status(err.statusCode || 500).json({'message': err.message});
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({message: 'Invalid ID'});
      return;
    }
    const result = await quotes.del(id);
    res.json({code: 200, message: result.message});
  } catch (err) {
    console.error(`Error while deleting quote `, err.message);
    res.status(err.statusCode || 500).json({'message': err.message});
  }
});

router.put('/', async function(req, res, next) {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      res.status(400).json({message: 'Invalid ID'});
      return;
    }
    const result = await quotes.update(req.body);
    res.json({code: 200, message: result.message});
  } catch (err) {
    console.error(`Error while updating quote `, err.message);
    res.status(err.statusCode || 500).json({'message': err.message});
  }
});

module.exports = router;
