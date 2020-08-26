const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

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
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if(person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  let size = persons.length
  let currentDate = new Date()

  res.send(`
    <p>Phonebook has info for ${size} people.</p>
    <p>${currentDate}</p>
  `)
})

const generateId = () => {
  return Math.random()
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'Number missing'
    })
  }

  if (persons.some(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'Name already exists'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person);
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})