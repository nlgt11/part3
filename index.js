require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const { json, request } = require('express');
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
});

app.post('/api/persons', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.number);
    let newPerson = new Person({
        name: req.body.name,
        number: req.body.number
    });
    newPerson.save();

    res.json(newPerson);
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
    const newPerson = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
        .then(newPerson => {
            res.json(newPerson);
        })
        .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => next(err));
});

app.get('/api/info', (req, res, next) => {
    let d = new Date();
    Person.count({}).then(count => {
        res.send(`Phonebook has info for ${count} people <br> ${d}`);
    })
    .catch(err => next(err));
});


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
app.use(errorHandler);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})