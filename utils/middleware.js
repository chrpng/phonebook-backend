const logger = require('./logger')

const requestLogger = (req, res, next) => {
	logger.info(`${req.method} ${req.path} ${req.statusCode} - ${req.body}`)
	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({
		error: 'unknown endpoint'
	})
}

const errorHandler = (error, req, res, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if(error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message })
	} else if (error.name === 'MongoError') {
		return res.status(400).send({ error: 'mutating immutable field _id' })
	}

	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
}