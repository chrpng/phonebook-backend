const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person');

// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//   },
//   {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4
//   }
// ]

// Middlewares
// checks build directory for addresses when GET request is received (serve static content)
app.use(express.static('build'))
// use express's json-parser to read from req body
app.use(express.json())

// allow resources to be requested from domain outside original source domain
app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
})
// use morgan to log messsages to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello Phonebook</h1>
    <h3>Commands</h3>
    <p>GET /api/persons</p>
    <p>GET /api/persons/:id</p>
    <p>GET /info</p>
    
    <p>POST /api/persons Request Object requires name and number props</p>
    
    <p>DELETE /api/persons/:id</p>
  `)
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then(person => {
      if(person) {
        console.log(person)
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    let size = persons.length;
    let currentDate = new Date()
    res.send(`
      <p>Phonebook has info for ${size} people.</p>
      <p>${currentDate}</p>
    `)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  for (const field of ['name', 'number']) {
    if (!body[field]) {
      return res.status(400).json({
        error: `Missing ${field}.`
      })
    }
  }

  Person.find({ name: body.name }).then(persons => {
    if (persons.length > 0) {
      return res.status(400).json({
        error: 'Name already exists'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(error => next(error))
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  for (const field of ['name', 'number']) {
    if (!body[field]) {
      return res.status(400).json({
        error: `Missing ${field}.`
      })
    }
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(person => {
      res.status(204).end()
    })
    .catch(error => next(error))
  
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoError') {
    return res.status(400).send({ error: 'mutating immutable field _id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})