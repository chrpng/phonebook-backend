const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://chrpng:${password}@cluster0.0arnp.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
})

const Person = mongoose.model('Person', personSchema)

if (!name && !number) {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name,
    number,
    id: uuidv4()
  })
  
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}



// exports.Person = Person;