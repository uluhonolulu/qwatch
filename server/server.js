const express = require('express');

const app = express();

//app.listen(3000);
console.log("Hi!");

app.get("/", (req, res) => {
    res.send("Hey dude!");
} );

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
