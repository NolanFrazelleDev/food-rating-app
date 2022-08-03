const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'food-rating'


    MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('food').find().sort({rating: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})


app.post('/addFood', (request, response) => {
    db.collection('food').insertOne({dishName: request.body.dishName,
    rating: request.body.rating})
    .then(result => {
        console.log('Food/Dish added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteFood', (request, response) => {
    db.collection('food').deleteOne({dishName: request.body.dishNameS})
    .then(result => {
        console.log('Food/Dish Deleted')
        response.json('Food/Dish Deleted')
    })
    .catch(error => console.error(error))

})







app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})