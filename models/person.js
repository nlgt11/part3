const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

console.log(`connecting to ${url}`);
mongoose.set('useFindAndModify', false)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to mongoDB');
    })
    .catch(err => {
        console.log('error connecting to MongoDB', err.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = Person = mongoose.model('Person', personSchema);