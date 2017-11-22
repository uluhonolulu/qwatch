var express = require('express');
var router = express.Router();
const request = require('request');
var S = require('string').extendPrototype();  //so that String gets new functions

//MongoDB  
const mongo = require('../infrastructure/mongo');

//receive a message
router.post('/', async (req, res) => {
    console.log("got webhook message");
    //console.log(JSON.stringify(req.body));
    let body = req.body;
    
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(async (entry) =>  {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0];
        //console.log("webhookEvent is " + webhookEvent);  //{"sender":{"id":"1498573146930404"},"recipient":{"id":"528874777474183"},"timestamp":1510736698907,"message":{"mid":"mid.$cAAG78Qq3R3pl8DHmG1fvuyoXL50j","seq":37364,"text":"yooo"}}
        let messageText = webhookEvent.message.text;
        console.log(messageText);
  
        //send a response
        try {
          var senderId = webhookEvent.sender.id;
          await handleRequest(messageText, senderId);   
        } catch (error) {
          console.log(error);
        }
      
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
      //TODO: send actions: message read, typing, typed
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }    
})

//verification 
router.get('/', function(req, res, next) {
    
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "from_fb";
    
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
        }
    }
});

module.exports = router;

//send a message
function sendMessage(recipientId, message){
  var data = {
    "recipient":{"id":recipientId},
    "message":{"text":message}
  };

  var url = "https://graph.facebook.com/v2.6/me/messages?access_token=" + process.env.PAGE_ACCESS_TOKEN;
  console.log(`sending reguest to FB: ${message}`);
  request.post(url, {form: data}, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the response.
  });

}

router.sendMessage = sendMessage;

async function handleRequest(messageText, senderId){
  sendMessage(senderId, `Got your request: ${messageText}.`);
  var coin = messageText.split(' ')[0];
  if(["BTC", "ETH", "LTC", "DOGE"].includes(coin.toUpperCase())){
    var address = messageText.chompLeft(coin + " ");
    createHook(coin, address, senderId);
    await saveRecord("Messenger", coin, address.toString(), senderId);
    sendMessage(senderId, `Watching address: ${address}.`);
  }else{
    sendMessage(senderId, `The coin ${coin} is not supported.`);
  }
}

async function saveRecord(source, coin, address, userId){
  console.log("Saving the record..");
  let db = await mongo.createConnection();
  console.log("awaited");
  db.collection("Watches").insertOne({
    source, coin, address, userId
  })
  db.close();   
  console.log("Record saved");   
  return true;
}

//.saveRecord = saveRecord;

const bcypher = require('blockcypher');

function createHook(coin, address, senderId) {
  var bcapi = new bcypher(coin,'main',process.env.BLOCKCYPHER_TOKEN);
  var app = "Messenger";
  var callbackUrl = `https://young-anchorage-67240.herokuapp.com/blockchain/${coin}/${address}/${app}/${senderId}`;
  var webhook = {
    event: "confirmed-tx",
    address,
    url: callbackUrl
  };
  bcapi.createHook(webhook, (error, body) => {
    console.log("Created a hook");
    console.log('error:', error || body.error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the response.
    if (body.error) {
      sendMessage(senderId, body.error);  //TODO: move this to the caller
    }    
  }); 
}
