
//MongoDB  
const {MongoClient} = require('mongodb');
const mongoUrl = process.env.MONGODB_URI;

async function createConnection() {
    // return a promise
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
          console.log(`Error connecting to MongoDB: ${err}`);
          // rejects with error if connection fails
          reject(err);
        }
        // returns handle to database if connection successful
        console.log("Connected to MongoDB");
        resolve(db);
      });
    });
  }

  module.exports = {createConnection};
