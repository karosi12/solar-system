const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const bluebird = require('bluebird')
const app = express();
const cors = require('cors')

mongoose.Promise = bluebird

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

const mongo = mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`)

mongo.then((data) => {
    console.log(`MongoDB Connection Established on development`)
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB', err)
  });

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);



app.post('/planet',  async function(req, res) {
    const planet = await planetModel.findOne({id: req.body.id});
    if(planet){
        return res.send(planetData);
    }
    alert("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9")
    res.send("Error in Planet Data")
})

app.get('/',   async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3000, () => {
    console.log("Server successfully running on port - " +3000);
})


module.exports = app;