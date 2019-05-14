const express = require("express")
const assert = require("assert")
const Apartments = require("../models/apartments");
const router = express.Router()
const db = require("../db/mysql-connector");
const jwt = require("../helpers/jwt")

class Queryhandler {

    constructor() {
    }

    query1(cb) {
        try {
            // Perform query
            const query = {
                sql: `SELECT apartment.StreetAddress, apartment.PostalCode, apartment.City, user.FirstName, user.LastName, user.DataOfBirth, reservation.ReservationId  
                FROM apartment
                LEFT JOIN reservation
                ON apartment.ApartmentId = reservation.ApartmentId
                LEFT JOIN user
                ON apartment.UserId = user.UserId;`,
                timeout: 2000
            };

            console.log(query)
            db.query(query, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(err, rows)
                    //next(err);
                } else {
                    console.log(rows)
                    cb(null, rows)
                }
            });
        } catch (ex) {
            next(ex);
        }
    }

    query2(apartment, cb) {
        try {
            const query = {
                sql: `SET @v1 := (SELECT MAX(ApartmentId) FROM apartment)+1;
                INSERT INTO apartment (ApartmentId, Description, StreetAddress, PostalCode, City, UserId) VALUES (@v1, ?, ?, ?, ?, ?)`,
                values: [apartment.description, apartment.streetAddress, apartment.postalCode, apartment.city, apartment.userId],
                timeout: 2000
            }

            console.log(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(err, rows)
                } else {
                    console.log(rows)
                    cb(null, rows)
                }
            });

        } catch (ex) {
            next(ex);
        }
    }

    //TODO: VRAAG STELLEN OVER NULL RETURN BIJ VALUE

    query3(var1, cb) {

        try {
            // Perform query
            const query = {
                sql: `SELECT apartment.StreetAddress, apartment.PostalCode, apartment.City, user.FirstName, user.LastName, user.DataOfBirth, reservation.ReservationId  
                FROM apartment
                LEFT JOIN reservation
                ON apartment.ApartmentId = reservation.ApartmentId
                LEFT JOIN user
                ON apartment.UserId = user.UserId
                WHERE apartment.ApartmentId = ?`,
                values: [var1],
                timeout: 2000
            };
            console.log(query)
            db.query(query, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(err, rows)
                    //next(err);
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