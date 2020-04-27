const express = require('express')
const bodyParser = require('body-parser')
const { getAllVillains, searchVillainBySlug, saveNewVillain } = require('./controllers/villains')



const app = express()

app.get('/villains', getAllVillains)

// app.get('/villains/:search', searchVillainBySlug)

app.post('/villains', bodyParser.json(), saveNewVillain)



app.listen(1339, () => {
  console.log('Listening on port 1339...')// eslint-disable-line no-console
})
