var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');

chai.should();

chai.use(chaiHttp);

const assert = chai.assert;
//might be cool

describe('Users', ()=> {
    it('User should succesfully login', function (done) {
        chai.request(server)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                "email": "jsnow@avans.nl",
                "password": "yoloswaggins"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            })
    });

})