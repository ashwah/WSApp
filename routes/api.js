const express = require ('express');
const router = express.Router();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const wss = require('../websockets')

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
  const text = 'INSERT INTO weight_data (pod_uuid, timestamp, weight_value) VALUES ($1, NOW(), $2)'
  const values = [req.body.pod_uuid, req.body.weight_value]
  pool.query(text, values, (error, results) => {
    if (error) {
      throw error
    }
    wss.clients.forEach((ws) => {
      console.log('sending?')
      var data = {
        pod_uuid: req.body.pod_uuid,
        weight_value: req.body.weight_value,
      }
      ws.send(JSON.stringify(data))
    })
    res.status(200).send('Weight data inserted')
  })
});

// Post weight data.
router.get('/weight-data', (req, res, next) => {
  const text = 'SELECT * FROM weight_data WHERE id IN (SELECT MAX(id) FROM weight_data GROUP BY pod_uuid);'
  //const values = [req.body.pod_uuid, req.body.weight_value]
  pool.query(text, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

module.exports = router;
