const express = require('express');

const app = express();

app.listen(3000);

app.get("/", (req, res) => {
    return "Hey dude!";
} );

const port = process.env.PORT || 3000;
app.listen(port);
