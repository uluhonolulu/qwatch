//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe("messenger webhook", () => {
    it("should handle webhook requests without errors and return 200 OK", (done) => {
        var data = require("./messengerRequest");
        var expect = chai.expect;
        chai.request(app)
            .post('/webhook')
            .send(data)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                done();               
            })
    })
})