//For the Express server, use morgan for request logging, 
//errorhandler for error handling and body-parser for parsing of payloads.
const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

//MongoDB connection string for the local database instance
const url = 'mongodb://localhost:27017/edx-course-db'
let app = express()
//middleware for logging and body parsing:
app.use(logger('dev'))
app.use(bodyParser.json())

mongoose.connect(url, { useNewUrlParser: true })

const Account = mongoose.model('Account',
    {
        name: String,
        balance: Number
    })

app.get('/accounts', (req, res, next) => {
    if (!req.body) { return res.sendStatus(400) }
    Account.find(function (err, Account) {
        //Account.find(function (error,Account) {
        //if (err) return console.error(err);
        if (err) return next(err)
        res.send(Account)
        //mongoose.disconnect() 
        // if use disconnect here it`s stop to response to the browser
    })

})

//take data from the request body (req.body) and use it in insert to create a new account. 
//Optionally, validate and sanitize the data of the request body with if/else statements 
//or the express-validate module.
app.post('/accounts', (req, res, next) => {
    Account.create(req.body, function (err, newAccount) {
        if (err) return next(err)
        res.send(newAccount)
    })
})

// PUT route, define a URL parameter :id and access it with req.params.id. Use req.body (request body) 
// to pass the new account to the update method. Use mongodb.ObjectID 
// with req.params.id to convert the string ID to an ObjectID which is needed for the update method query:
app.put('/accounts/:id', (req, res, next) => {
    Account.updateOne({ _id: req.params.id }, { $set: req.body },
        function (err, reAccount) {
            if (err) return next(err)
            res.send(reAccount)
        })
})

//In DELETE, use URL parameter for the ID again. 
//This time, the MongoDB method is remove but it also takes the URL parameter ID wrapped 
//in mongodb.ObjectID for the proper object type in the query
app.delete('/accounts/:id', (req, res, next) => {
    //Account.remove({ _id: req.params.id }, function (err, conta) {
    Account.deleteOne({ _id: req.params.id }, function (err, conta) {
        if (err) return next(err)
        res.send(conta)
    })
})

//Error handler just will give a nice erro page 
app.use(errorhandler())
app.listen(3000)