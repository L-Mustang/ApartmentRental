var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');

chai.should();

const assert = chai.assert

chai.use(chaiHttp);

function dummyTest() {
    assert.equal(1+1, 2, "Should be 2")
}