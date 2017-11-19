var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    console.log("new transaction");
    console.log(JSON.stringify(req.body));    
});

module.exports = router;