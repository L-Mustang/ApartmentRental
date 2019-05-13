const express = require("express")
const assert = require("assert")
const Apartments = require("../models/apartments");
const router = express.Router()
const db = require("../db/mysql-connector");
const jwt = require("../helpers/jwt")

const apartments = {
    sql: `SELECT apartment.StreetAddress, apartment.PostalCode, apartment.City, user.FirstName, user.LastName, user.DataOfBirth, reservation.ReservationId  
    FROM apartment
    LEFT JOIN reservation
    ON apartment.ApartmentId = reservation.ApartmentId
    LEFT JOIN user
    ON apartment.UserId = user.UserId;`,
    timeout: 2000
};

const apartments2 = {
    sql: `SELECT *  
    FROM apartment
    LEFT JOIN reservation
    ON apartment.ApartmentId = reservation.ApartmentId
    LEFT JOIN user
    ON apartment.UserId = user.UserId;`,
    timeout: 2000
};

var queries = {1: apartments, 2: apartments2, /* and so on */};


class Queryhandler {

    constructor() {
    }

query(queryname, cb) {

    try {
        // Perform query
        const query = queries[queryname]
        console.log(query)
        db.query(query, (err, rows, fields) => {
            console.log("queryhandler")
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log(rows)
                cb(null, rows)
            }
        });
    } catch (ex) {
        next(ex);
    }
}
}




module.exports = Queryhandler