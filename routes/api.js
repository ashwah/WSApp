const express = require ('express');
const router = express.Router();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// A pool to manage database connections.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get UUID.
router.get('/uuid', (req, res, next) => {
  res.json(uuidv4())
})

// Post weight data.
router.post('/weight-data', (req, res, next) => {
  console.log(req.body);
  var date = new Date();
  req.body.timestamp = date.toISOString();
  const text = 'INSERT INTO weight_data (pod_uuid, timestamp, weight_value) VALUES ($1, $2, $3)'
  const values = [req.body.pod_uuid, req.body.timestamp, req.body.weight_value]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
  })
  next();
});

// Get weight data.
router.get('/weight-data', (req, res, next) => {
  const text = 'SELECT * FROM weight_data WHERE id IN (SELECT MAX(id) FROM weight_data GROUP BY pod_uuid);'
  const values = [req.body.pod_uuid, req.body.weight_value]
  pool.query(text, (error, results) => {
    console.log('help')
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

module.exports = router;
