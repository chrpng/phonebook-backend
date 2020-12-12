const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const config = require('../utils/config')
const logger = require('../utils/logger')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch(error => {
		logger.error('error connecting to MongoDB:', error.message)
	})

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('runValidators', true)

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		unique: true,
	},
	number: {
		type: String,
		minlength: 8,
	},
	id: String,
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)