var express = require('express');
var router = express.Router();
const messenger = require('./messenger');
const mongo = require('../infrastructure/mongo');

const {MongoClient} = require('mongodb');
// const url = process.env.MONGODB_URI;
// MongoClient.connect(url, (err,db) => {
//     if (err) {
//         console.log(`Error connecting to MongoDB: ${err}`);
//     }
//     db.close();
// });


router.post('/', async (req, res) => {
    console.log("new transaction:");
    console.log(JSON.stringify(req.body));  
    messenger.sendMessage("1498573146930404", "got transaction"); 

    let db = await mongo.createConnection();   
    db.collection("Transactions").insertOne(req.body);
    db.close(); 
    res.status(200).send('EVENT_RECEIVED');
});

module.exports = router;