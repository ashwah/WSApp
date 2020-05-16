const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');

app.get('/', (req, res, next) => {

  res.send(uuidv4())
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});