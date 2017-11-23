//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

const mongo = require('../infrastructure/mongo');
const messenger = require('../routes/messenger');
// describe("test async", () => {
//     it("should connect", async () => {
//         return await mongo.createConnection(); 
//     });

//     it("should save", async () => {
//         return await messenger.saveRecord("test", "BTG", "addr", "me");
//     })
// });

describe("messenger webhook", () => {
    it("calling createHook", (done) => {
        messenger.createHook('btg', 'addr', 'senderId');
        done();
    });

    it("should handle webhook requests without errors and return 200 OK", () => {
        var data = require("./messengerRequest");
        var expect = chai.expect;
        return chai.request(app)
            .post('/webhook')
            .send(data)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                //done();               
            })
    })
});

