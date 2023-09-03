
const mongoose = require('mongoose')

const password = process.argv[2];
const url = `mongodb+srv://fso:${password}@cluster0.ywynubo.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 5){
    Person.find({}).then(res => {
        res.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

}
else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(res => {
        console.log('person saved!')
        mongoose.connection.close();
    })
}