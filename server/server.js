const express = require('express');

const app = express();

//app.listen(3000);
console.log("Hi!");

app.get("/", (req, res) => {
    res.send("Hey dude!");
} );

const port = process.env.PORT || 3000;
app.listen(port);
