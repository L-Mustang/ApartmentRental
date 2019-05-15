var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./index.js');
var assert = require('assert');

chai.should();

chai.use(chaiHttp);

//in command line: npm apartment.test
describe('Apartments', () => {

    it('Create a new apartment and post', function (done) {
        chai.request(server)
            .post('/apiv1/apartments')
            .send({
                "ApartmentId": "2",
                "Description": "testAppartment1",
                "StreetAddress": "testStraat1",
                "PostalCode": "1234 AB",
                "City": "Breda",
                "UserId": "8"
            })
            .end(function(err, res) {
                res.should.have.status(200);
                done()
            })
    });
});
