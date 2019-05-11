const express       = require('express');
const bodyParser    = require('body-parser');
const apiv1         = require('./routes/apiv1');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Middelware, logging voor alle request
app.all('*', function (req, res, next) {
    next();
});

// Routing with versions
app.use('/apiv1', apiv1);

// ECMA 6
const port = 8080;
const server = app.listen(port, () => {
    console.log("Hi students of I4, the magic happens ar port " + server.address().port);
});

// // ECMA 5
// const server = app.listen(port, function() {
//     console.log("The magic happens ar port " + server.address().port);
// });