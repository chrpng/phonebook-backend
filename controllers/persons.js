const personsRouter = require('express').Router()
const Person = require('./../models/person')

personsRouter.get('/', (req, res) => {
	Person.find({})
		.then(persons => {
			res.json(persons)
		})
})

personsRouter.get('/:id', (req, res, next) => {
	const id = req.params.id

	Person.findById(id)
		.then(person => {
			if(person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

personsRouter.post('/', (req, res, next) => {
	const body = req.body

	for (const field of ['name', 'number']) {
		if (!body[field]) {
			return res.status(400).json({
				error: `Missing ${field}.`
			})
		}
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

personsRouter.put('/:id', (req, res, next) => {
	const id = String(req.params.id)
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

	// The value of 'this' may not be defined in validation so context: 'query' sets it
	// https://github.com/blakehaswell/mongoose-unique-validator#find--updates
	// https://mongoosejs.com/docs/validation.html#update-validators-and-this
	Person.findByIdAndUpdate(id, person, { context: 'query', new: true })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => {
			next(error)
		})
})

personsRouter.delete('/:id', (req, res, next) => {
	const id = req.params.id
	Person.findByIdAndDelete(id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))

})

module.exports = personsRouter