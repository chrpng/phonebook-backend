const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

const middleware = require('./utils/middleware')

const personsRouter = require('./controllers/persons')
const defaultRouter = require('./controllers/default')

// Middlewares
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, ) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/persons', personsRouter)
app.use('/', defaultRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app