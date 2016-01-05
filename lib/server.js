const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const HOST = '127.0.0.1'
const PORT = '3035'
const app = express()
const ROOT = path.resolve(__dirname, '../')

app.disable('x-powered-by')
app.set('views', [path.join(ROOT, 'lib/modules/save/templates')])
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(bodyParser.text())

require('./routes/index.js')(app)

// Kickoff HTTP server
app.listen(PORT, HOST, () => {
  console.log(`request-logger listening on ${HOST}:${PORT}`)
})
