const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

const middleware = require('./utils/middleware')

const personsRouter = require('./controllers/persons')
const defaultRouter = require('./controllers/default')

// Middlewares
// allow resources to be requested from domain outside original source domain
app.use(cors())
// checks build directory for addresses when GET request is received (serve static content)
app.use(express.static('build'))
// use express's json-parser to read from req body
app.use(express.json())

// custom morgan :body token
morgan.token('body', (req, ) => JSON.stringify(req.body))
// use morgan to log messsages to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// my attempt to replicate morgan functionality
// app.use(middleware.requestLogger)


app.use('/api/persons', personsRouter)
app.use('/', defaultRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app