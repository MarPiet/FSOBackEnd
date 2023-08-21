const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));


const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(x => x.id === id) 
    if(person){
        response.json(person).end();
    }
    response.statusMessage = `Person not found by id ${id}`;
    response.status(404).end();
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    response.status(204).json(persons.filter(x => x.id !== id))
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if(!person.name || !person.number){
        response.status(400).json({error: 'no name or number'})
        return;
    }
    if(persons.some(x => x.name === person.name)){
        response.status(400).json({error: 'name must be unique'})
        return;
    }

    person["id"] =  Math.floor(Math.random() * 123123123)
    persons.push(person);
    response.json(person)
})



app.get('/info', (request, response) => {
    console.log(request);
    response.send(`Phonebook has info for ${persons.length} people <br /><br /> ${new Date()}`)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})