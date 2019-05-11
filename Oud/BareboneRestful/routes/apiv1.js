const express = require('express');
const router = express.Router();
const Persons = require('../models/person');
const _persons = new Persons();

//
// URL parameters
//
router.post('/person', function(req, res) {

    let firstname = req.body.firstname || '';

    _persons.create(firstname, (err, result) => {
        if(err) {
            res.status(500).json(err.toString())
        } else {
            res.status(200).json(result)
        }
    });
});

//
// URL parameters
//
router.get('/persons', function(req, res) {

    const firstname = req.query.firstname;

    if( firstname ) {
        _persons.read( firstname, (err, result) => {
            if(err) {
                res.status(500).json(err.toString())
            } else {
                res.status(200).json(result)
            }
        })
    } else {
        _persons.readAll((err, result) => {
            if (err) {
                res.status(500).json(err.toString())
            } else {
                res.status(200).json(result)
            }
        })
    }
});


// Fall back, display some info
router.all('*', function (req, res) {
    res.status(200);
    res.json({
        "description": "API version 1"
    });
});

module.exports = router;