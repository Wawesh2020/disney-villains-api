const express = require('express')
const bodyParser = require('body-parser')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('./controllers/villains')



const app = express()

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.post('/villains', bodyParser.json(), saveNewVillain)

app.all('*', (request, response) => {
  return response.sendStatus(404)
})

app.listen(1339, () => {
  console.log('Listening on port 1339...')// eslint-disable-line no-console
})
