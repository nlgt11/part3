const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
const uniqueValidator = require('mongoose-unique-validator')

console.log(`connecting to ${url}`)
mongoose.set('useFindAndModify', false)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => {
    console.log('connected to mongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
personSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)