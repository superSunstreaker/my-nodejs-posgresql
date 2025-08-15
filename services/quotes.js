const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT * FROM quote ORDER BY id OFFSET $1 LIMIT $2', 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  const totalRows = await db.query('SELECT COUNT(*) FROM quote');
  const total = parseInt(totalRows[0].count, 10);

  return {
    data,
    meta,
    total
  }
}

function validateCreate(quote) {
  let messages = [];

  if (!quote) {
    messages.push('No object is provided');
  }

  if (!quote.quote) {
    messages.push('Quote is empty');
  }

  if (!quote.author) {
    messages.push('Author is empty');
  }

  if (quote.quote && quote.quote.length > 255) {
    messages.push('Quote cannot be longer than 255 characters');
  }

  if (quote.author && quote.author.length > 255) {
    messages.push('Author name cannot be longer than 255 characters');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function create(quote){
  validateCreate(quote);
  console.log('Creating quote: ', quote);

  const result = await db.query(
    'INSERT INTO quote(quote, author, age, sex) VALUES ($1, $2, $3, $4) RETURNING *',
    [quote.quote, quote.author, quote.age, quote.sex]
  );
  let message = 'Error in creating quote';

  if (result.length) {
    message = 'Quote created successfully';
  }

  return {message};
}

async function del(id) {
  const result = await db.query(
    'DELETE FROM quote WHERE id = $1 RETURNING *',
    [id]
  );
  return {
    message: result.length ? 'Quote deleted successfully' : 'Quote not found'
  }
}

async function update(res) {
  const {
    id,
    quote,
    author,
    age,
    sex
  } = res;
  validateCreate(res);

  return db.query(
    'UPDATE quote SET quote = $1, author = $2, age = $3, sex = $4 WHERE id = $5 RETURNING *',
    [quote, author, age, sex, id]
  ).then(result => {
    let message = 'Error in updating quote';
    if (result.length) {
      message = 'Quote updated successfully';
    }
    return {message};
  });
}

async function getById(id) {
  if (!id) {
    let error = new Error('No id provided');
    error.statusCode = 400;
    throw error;
  }

  return db.query(
    'SELECT id, quote, author, age, sex FROM quote WHERE id = $1',
    [id]
  ).then(rows => {
    if (!rows.length) {
      let error = new Error('Quote not found');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  });
}

module.exports = {
  getMultiple,
  create,
  del,
  update, 
  getById
}
