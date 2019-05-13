const express = require("express");
const assert = require("assert");
const router = express.Router();
const db = require("../db/mysql-connector");
const Queryhandler = require("../helpers/queryhandler")

const _queryhandler = new Queryhandler()
class Apartments {

    constructor() {
        this._db = []
    }

    //Crud operations - The Create
    create(apartment, cb = null) {
        this._db.push(apartment);
        if (cb != null) {
            cb(null, 'ok');
        }
    }

    readAll(cb) {
        console.log("readAll")
        // try {
        //     // Construct query object
        //     const query = {
        //         sql: `SELECT apartment.StreetAddress, apartment.PostalCode, apartment.City, user.FirstName, user.LastName, user.DataOfBirth, reservation.ReservationId  
        //         FROM apartment
        //         LEFT JOIN reservation
        //         ON apartment.ApartmentId = reservation.ApartmentId
        //         LEFT JOIN user
        //         ON apartment.UserId = user.UserId;`,
        //         timeout: 2000
        //     };
        //     // Perform query
        //     db.query(query, (err, rows, fields) => {
        //         //console.log(query)
        //         if (err) {
        //             console.log(err);
        //             next(err);
        //         } else {
        //             console.log(rows)
        //             cb(null, rows);
        //         }
        //     });
        // } catch (ex) {
        //     next(ex);
        // }

        _queryhandler.query(2, (err, result) => {
            cb(null, result)
        })

    }

    read(id, cb) {
        this._db.find((apartment) => {
            if (apartment.id === id) {
                cb(null, apartment);
            }
        })
    }
}

module.exports = Apartments