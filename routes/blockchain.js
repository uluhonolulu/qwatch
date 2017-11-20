var express = require('express');
var router = express.Router();

var messenger = require('./messenger');

router.post('/', (req, res) => {
    console.log("new transaction");
    console.log(JSON.stringify(req.body));  
    sendMessage("1498573146930404", "got transaction"); 
});

module.exports = router;