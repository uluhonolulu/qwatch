const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(express.static(__dirname + '/../public' ));
app.use(bodyParser.json())

//app.listen(3000);
console.log("Hi!");

app.get("/", (req, res) => {
    console.log("console");
    res.send("Hey dude!");
} );

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
    console.log("got post");
    console.log(JSON.stringify(req.body));
    let body = req.body;
    
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);  //{"sender":{"id":"1498573146930404"},"recipient":{"id":"528874777474183"},"timestamp":1510736698907,"message":{"mid":"mid.$cAAG78Qq3R3pl8DHmG1fvuyoXL50j","seq":37364,"text":"yooo"}}

        //send a response
        var senderId = webhookEvent.sender.id;
        request.post("https://graph.facebook.com/v2.6/me/messages?access_token=" + process.env.PAGE_ACCESS_TOKEN, {
          "recipient":{"id":senderId},
          "message":{"text":"hey bro, whassup?"}
        }, function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          console.log('body:', body); // Print the HTML for the Google homepage.
        });

      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
   
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    
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

const port = process.env.PORT || 3000;
app.listen(port);
