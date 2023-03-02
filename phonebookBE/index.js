const express = require('express')
const app = express()
var morgan = require('morgan')

let people = [
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

// How express.js uses these middleware function to handling request/response objects
app.use(express.json())
app.use(requestLogger)
app.use(morgan(function (tokens, req, res) {
    const bod = JSON.stringify(req.body)
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      bod
    ].join(' ')
  }
))




// HTTP GET request
app.get('/api/people', (request, response) => {
    response.json(people)
})


app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
    // response.send(`<h1>This is info page!</h1>`)
    response.write(`Phonebook has information for ${people.length} people\n`)  // This step is completed but how do I use an h1 tag here (the HTML tags)
    response.write(`${new Date()}`)
    response.end()
    // response.send('Let me know if this page lives!')
})


app.get('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(s => s.id === id)

    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

function requestLogger (request, response, next) {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('------')
    next()
}

// app.use(requestLogger)

//HTTP DELETE request

// app.delete('/api/people/:id', (request, response) => {
//     const id = Number(request.params.id)
//     people = people.filter(p => p.id !== id)

//     response.status(204).end()
// })


const generateId = () => {
    return Math.floor(Math.random() * 9999)
}


app.post('/api/people', (request, response) => {
    const body = request.body

    if (!body.name || !body.number){
        return response.status(400).json('Either name or number is missing, please try again!')
    }else if (people.find(p => p.name === body.name)){
        return response.status(400).json('This person already exists, please try again!')
    }

    const newID = generateId()
    const person = {
        id: newID,
        name: body.name,
        number: body.number
    }

    

    people = people.concat(person)
    response.json(people)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


const PORT = 3002
app.listen(PORT)
console.log(`Server listening on ${PORT}`)