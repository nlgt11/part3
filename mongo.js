const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://nlgt11:${password}@cluster0-wbxdi.mongodb.net/phone-book?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Phone = mongoose.model('Phone', phoneSchema)

if  (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const newPhone = new Phone({
    name,
    number
  })

  newPhone.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
if (process.argv.length === 3) {
  Phone.find({}).then(phones => {
    for (var phone of phones) {
      console.log(`${phone.name} ${phone.number}`)
    }
    mongoose.connection.close()
  })
}