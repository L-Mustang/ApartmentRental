var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');

chai.should();

chai.use(chaiHttp);

describe('Users/', ()=> {

    it('Register new user', (done) => {
        chai.request(server)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({
                "first_name": "MaboiShrek",
                "last_name": "oftheSwamp",
                "street_address": "swamp Lane",
                "postal_code": "9374 SE",
                "city": "wonderland",
                "date_of_birth": "15-01-1955",
                "phone_number": "0637184761",
                "email": "shrekkimus@swamp.lol",
                "password": "shrek&fiona4ever"
            })
            .end((err, res, body) => {
                res.should.have.status(200);
                done();
            })
    })

    it('User succesfully login', function (done) {
        chai.request(server)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                "email": "shrekkimus@swamp.lol",
                "password": "shrek&fiona4ever"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            })
    });

    it('User invalid login', function (done) {
        chai.request(server)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                "email": "test@test.test",
                "password": "test"
            })
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            })
    });
});

describe('apartments/', () => {

    it('Create a new apartment and post', (done) => {
        chai.request(server)
            .post('/apiv1/apartments')
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTg2MzYyNDgsImlhdCI6MTU1Nzc3MjI0OCwic3ViIjoianNub3dAYXZhbnMubmwifQ.9VEzE7gPlTAAwIDnFzEVFYMJwsJAkmHzumRmWckXNFM','Content-Type', 'application/json')
            .send({                
                "description": "testAppartment1",
                "street_address": "testStraat1",
                "postal_code": "1234 AB",
                "city": "Breda",
                "user_id": "1" //Make sure to supply valid UserId
            })
            .end(function(err, res) {
                res.should.have.status(200);
                done()
            })
    });
});