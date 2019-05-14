const express = require("express")
const assert = require("assert")
const Apartments = require("../models/apartments");
const router = express.Router()
const db = require("../db/mysql-connector");
const jwt = require("../helpers/jwt")
const logger = require("tracer").colorConsole();


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
            // Perform query
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

    query4(apartment, var1, cb) {

        try {
            const query = {
                sql: `UPDATE apartment
                SET Description = ?, StreetAddress = ?,  PostalCode = ?, City = ?, UserId = ?
                WHERE apartment.ApartmentId = ?;`,
                values: [apartment.description, apartment.streetAddress, apartment.postalCode, apartment.city, apartment.userId, var1],
                timeout: 2000
            };
            console.log(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    console.log(rows);
                    cb(err, rows)
                    //next(err);
                } else {
                    console.log(rows)
                    cb(null, rows)
                }
            });
        }catch (ex) {
            next(ex);
        }
    }

    query5(var1, var2, cb) {
        try {
            const query1 = {
                sql: `SELECT user.EmailAddress FROM user LEFT JOIN apartment ON user.UserId = apartment.UserId WHERE apartment.ApartmentId = ?;`,
                values: [var1],
                timeout: 2000
            };
            logger.debug(query1)
            // Perform query
            db.query(query1, (err, rows, fields) => {
                if (err) {
                    logger.debug(rows);
                    cb(err, rows)
                    //next(err);
                } else {
                    if (!(rows.length==0)) {
                        const email1 = rows[0].EmailAddress                          
                        const email2 = jwt.decode(var2).sub
                        logger.info("Retrieved email: ", email1)
                        logger.info("Decoded token email: ", email2)

                        if (email1==email2){
                            const query2 = {
                                sql: `DELETE FROM apartment WHERE apartment.ApartmentId=?;`,
                                values: [var1],
                                timeout: 2000
                            };
                            
                            console.log(query2)
                            // Perform query
                            db.query(query2, (err, rows, fields) => {
                                if (err) {
                                    console.log(rows);
                                    cb(err, rows)
                                    //next(err);
                                } else {
                                    console.log(rows)
                                    cb(null, rows)
                                }
                            });
                        }
                        else {
                            logger.warn("Incorrect/invalid token: you cannot delete this entry")
                            cb(null, "Incorrect/invalid token: you cannot delete this entry")
                        }
                    }
                    else {
                        logger.warn("No apartment found")
                        cb(null, "No apartment found")
                    }
                }
            });
        }catch (ex) {
            next(ex);
        }
    }

query7(var1, cb) {

    try {
        const query = {
            sql: `SELECT * 
            FROM reservation 
            JOIN apartment 
            ON reservation.ApartmentId = apartment.ApartmentId 
            WHERE reservation.ApartmentId = ?`,
            values: [var1],
            timeout: 2000
        };
        console.log(query)
        // Perform query
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

query8(var1, var2, cb) {

    try {
        const query = {
            sql: `SELECT * 
            FROM reservation 
            JOIN apartment 
            ON reservation.ApartmentId = apartment.ApartmentId 
            WHERE reservation.ApartmentId = ? AND reservation.ReservationId = ?`,
            values: [var1, var2],
            timeout: 2000
        };
        console.log(query)
        // Perform query
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

query9(status, var1, var2, cb) {

    try {
        const query = {
            sql: `UPDATE reservation
            SET status = ?
                WHERE reservation.apartmentId = ? AND reservation.reservationID = ?;`,
            values: [status, var1, var2],
            timeout: 2000
        };
        console.log(query)
        // Perform query
        db.query(query, (err, rows, fields) => {
            if (err) {
                console.log(rows);
                cb(err, rows)
                //next(err);
            } else {
                console.log(rows)
                cb(null, rows)
            }
        });
    }catch (ex) {
        next(ex);
    }
}

}


module.exports = Queryhandler