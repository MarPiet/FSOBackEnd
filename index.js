require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
  }
app.use(errorHandler)


app.get('/api/persons', (request, response) => {
    Person.find({}).then(res => {
        res.forEach(person => {
            console.log(person)
        })
        response.json(res)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findById(id).then(person => {
        if(person)
            response.json(person);
        else{
            response.statusMessage = `Person not found by id ${id}`
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id).then(person => {
        response.status(204).end() 
    })
    .catch(error => next(error))
    // response.status(204).json(persons.filter(x => x.id !== id))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number){
        response.status(400).json({error: 'no name or number'})
        return;
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    const error = person.validateSync();
    console.log(error);
    // person["id"] =  Math.floor(Math.random() * 123123123)
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const body = request.body
    Person.findByIdAndUpdate(id, {number: body.number}, {new: true, runValidators: true, context: 'query'}).then(person => {
        console.log(person.number)
        response.json(person)
    })  
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.count().then(count => {
        response.send(`Phonebook has info for ${count} people <br /><br /> ${new Date()}`)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})