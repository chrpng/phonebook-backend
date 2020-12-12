const defaultRouter = require('express').Router()
const Person = require('../models/person')

defaultRouter.get('/', (req, res) => {
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

defaultRouter.get('/info', (req, res) => {
	Person.find({}).then(persons => {
		let size = persons.length
		let currentDate = new Date()
		res.send(`
      <p>Phonebook has info for ${size} people.</p>
      <p>${currentDate}</p>
    `)
	})
})

module.exports = defaultRouter