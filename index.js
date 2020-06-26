const express = require('express');
const app = express();
const morgan = require('morgan');
const { json } = require('express');
const cors = require('cors');
const static = require('static');

app.use(cors());
app.use(static('build'));
app.use(express.json());

// morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
// app.use(morgan('tiny body'));

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 4
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.post('/api/persons', (req, res) => {
    let newPerson = req.body;
    newPerson.id = Math.floor(Math.random() * 1000);

    if ( !newPerson.name || !newPerson.number ) {
        return res.status(400).json({ error: 'missing name of number' });
    }

    if ( persons.findIndex(p => p.name === newPerson.name ) != -1 ) {
        return res.status(400).json({  error: 'name must be unique' });
    }

    persons.push(newPerson);
    res.json(newPerson);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    }
    else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
});

app.get('/api/info', (req, res) => {
    let d = new Date();
    res.send(`Phonebook has info for ${persons.length} people <br> ${d}`);
});

const PORT = process.env.PORT||3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})