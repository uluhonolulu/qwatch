var express = require('express');
var router = express.Router();
const messenger = require('./messenger');
const mongo = require('../infrastructure/mongo');

router.post('/:coin/:address/:app/:userId', async (req, res) => {
    console.log("new transaction:");
    var transaction = req.body;
    //console.log(JSON.stringify(req.body));  
    //for now, we only work with deposits 
    var address = req.params.address;   //wallet address we're watching
    var transactionOutput = transaction.outputs.find(output => output.addresses[0] === address);
    if (transactionOutput) {
        var coin = req.params.coin.toUpperCase();
        var amount = transactionOutput.value*0.00000001;  //50000 => 0.0005
        var app = req.params.app; //should be Messenger for now
        var userId = req.params.userId  //the ID of the Messenger user
        if (app === "Messenger") {
            let message = `Deposited ${amount} ${coin} into ${address}.`;//Deposited 0.0005 BTC into 3QTkiJ2vwhErpBE5oLBifPmG68bt4KcQDy
            messenger.sendMessage(userId, message);
        }
    }

    //track incoming 
    let db = await mongo.createConnection();   
    db.collection("Transactions").insertOne(req.body);
    db.close(); 
    res.status(200).send('EVENT_RECEIVED');
});



module.exports = router;