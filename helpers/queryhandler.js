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
                sql: `SELECT apartment.StreetAddress, apartment.PostalCode, apartment.City, user.FirstName, user.LastName, user.DataOfBirth, reservation.ReservationId FROM apartment LEFT JOIN reservation ON apartment.ApartmentId = reservation.ApartmentId LEFT JOIN user ON apartment.UserId = user.UserId;`,
                timeout: 2000
            };

            logger.debug(query)
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.error(err);
                    cb(err, rows)
                    //next(err);
                } else {
                    logger.info(rows)
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

            logger.debug(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.err(err);
                    cb(err, rows)
                } else {
                    logger.info(rows)
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
                sql: `SELECT apartment.StreetAddress, apartment.PostalCode, apartment.City, user.FirstName, user.LastName, user.DataOfBirth, reservation.ReservationId FROM apartment LEFT JOIN reservation ON apartment.ApartmentId = reservation.ApartmentId LEFT JOIN user ON apartment.UserId = user.UserId WHERE apartment.ApartmentId = ?`,
                values: [var1],
                timeout: 2000
            };
            logger.debug(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.error(err);
                    cb(err, rows)
                    //next(err);
                } else {
                    logger.info(rows)
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
                sql: `UPDATE apartment SET Description = ?, StreetAddress = ?,  PostalCode = ?, City = ?, UserId = ? WHERE apartment.ApartmentId = ?;`,
                values: [apartment.description, apartment.streetAddress, apartment.postalCode, apartment.city, apartment.userId, var1],
                timeout: 2000
            };
            logger.debug(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.error(rows);
                    cb(err, rows)
                    //next(err);
                } else {
                    logger.info(rows)
                    cb(null, rows)
                }
            });
        } catch (ex) {
            next(ex);
        }
    }

    query5(var1, var2, cb) {
        try {
            const query = {
                sql: `SELECT user.EmailAddress FROM user LEFT JOIN apartment ON user.UserId = apartment.UserId WHERE apartment.ApartmentId = ?;`,
                values: [var1],
                timeout: 2000
            };
            logger.debug(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.debug(rows);
                    cb(err, rows)
                    //next(err);
                } else {
                    if (!(rows.length == 0)) {
                        const email1 = rows[0].EmailAddress
                        const email2 = jwt.decode(var2).sub
                        logger.info("Retrieved email: ", email1)
                        logger.info("Decoded token email: ", email2)

                        if (email1 == email2) {
                            const query = {
                                sql: `DELETE FROM apartment WHERE apartment.ApartmentId=?;`,
                                values: [var1],
                                timeout: 2000
                            };

                            logger.debug(query)
                            // Perform query
                            db.query(query, (err, rows, fields) => {
                                if (err) {
                                    logger.error(rows);
                                    cb(err, rows)
                                    //next(err);
                                } else {
                                    logger.info(rows)
                                    cb(null, rows)
                                }
                            });
                        }
                        else {
                            logger.warn("Incorrect/invalid token: you cannot delete this entry")
                            cb("Incorrect/invalid token: you cannot delete this entry", null)
                        }
                    }
                    else {
                        logger.warn("No apartment found")
                        cb("No apartment found", null)
                    }
                }
            });
        } catch (ex) {
            next(ex);
        }
    }

    query6(reservation, var1, cb) {
        try {
            var startDate = reservation.startDate;
            var currentDate = new Date();
            var userId;

            startDate = new Date(startDate);

            if (startDate < currentDate) {
                logger.warn("StartDate is smaller than the current date")
                cb("StartDate is smaller than the current date", null)
            }
            else {
                var endDate = reservation.endDate;
                endDate = new Date(endDate);
                if (endDate <= startDate) {
                    logger.warn("EndDate is greater than or equal to StartDate")
                    cb("EndDate is greater than or equal to StartDate", null)
                }
                else {
                    const email = jwt.decode(var1).sub
                    const query = {
                        sql: `SELECT user.UserId FROM user WHERE user.EmailAddress = ?;`,
                        values: [email],
                        timeout: 2000
                    };
                    logger.debug(query)

                    // Perform query for userId
                    db.query(query, (err, rows, fields) => {
                        if (err) {
                            logger.debug(rows);
                            cb(err, rows)
                        } else {
                            userId = rows[0].UserId
                            logger.info("User ID: ", userId)

                            const query = {
                                sql: `SELECT apartment.ApartmentId FROM apartment WHERE apartment.ApartmentId = ?;`,
                                values: [reservation.apartmentId],
                                timeout: 2000
                            };
                            logger.debug(query)

                            // Perform query for apartmentId
                            db.query(query, (err, rows, fields) => {
                                if (err) {
                                    logger.error(rows);
                                    cb(err, rows)
                                } else {
                                    logger.info(rows);
                                    if (!(rows.length == 0)) {

                                        const query = {
                                            sql: `INSERT INTO reservation (StartDate, EndDate, Status, UserId, ApartmentId) VALUES (?, ?, ?, ?, ?);`,
                                            values: [reservation.startDate, reservation.endDate, reservation.status, userId, reservation.apartmentId],
                                            timeout: 2000
                                        };
                                        logger.debug(query)
                                        // Perform query
                                        db.query(query, (err, rows, fields) => {
                                            if (err) {
                                                logger.error(rows);
                                                cb(err, rows)
                                                //next(err);
                                            } else {
                                                logger.info(rows)
                                                cb(null, rows)
                                            }
                                        });
                                    }
                                    else {
                                        logger.warn("ApartmentId invalid")
                                        cb("ApartmentId invalid", null)
                                    }
                                }
                            })


                        }
                    })
                }
            }
        }
        catch (ex) {
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
            logger.debug(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.error(err);
                    cb(err, rows)
                    //next(err);
                } else {
                    logger.info(rows)
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

    query9(status, var1, var2, var3, cb) {
        try {
            const query = {
                sql: `SELECT user.EmailAddress FROM user LEFT JOIN apartment ON user.UserId = apartment.UserId WHERE apartment.ApartmentId = ?;`,
                values: [var1],
                timeout: 2000
            };
            logger.debug(query)
            // Perform query
            db.query(query, (err, rows, fields) => {
                if (err) {
                    logger.debug(rows);
                    cb(err, rows)
                    //next(err);
                } else {
                    if (!(rows.length == 0)) {
                        const email1 = rows[0].EmailAddress
                        const email2 = jwt.decode(var3).sub
                        logger.info("Retrieved email: ", email1)
                        logger.info("Decoded token email: ", email2)

                        if (email1 == email2) {
                            const query = {
                                sql: `UPDATE reservation SET status = ? WHERE reservation.apartmentId = ? AND reservation.reservationID = ?;`,
                                values: [status, var1, var2],
                                timeout: 2000
                            };

                            logger.debug(query)
                            // Perform query
                            db.query(query, (err, rows, fields) => {
                                if (err) {
                                    logger.error(rows);
                                    cb(err, rows)
                                    //next(err);
                                } else {
                                    logger.info(rows)
                                    cb(null, rows)
                                }
                            });
                        }
                        else {
                            logger.warn("Incorrect/invalid token: you cannot alter this entry")
                            cb("Incorrect/invalid token: you cannot alter this entry", null)
                        }
                    }
                    else {
                        logger.warn("No apartment found")
                        cb("No apartment found", null)
                    }
                }
            });
        } catch (ex) {
            next(ex);
        }
    }

    //     try {
    //         const query = {
    //             sql: `UPDATE reservation
    //         SET status = ?
    //             WHERE reservation.apartmentId = ? AND reservation.reservationID = ?;`,
    //             values: [status, var1, var2],
    //             timeout: 2000
    //         };
    //         logger.debug(query)
    //         // Perform query
    //         db.query(query, (err, rows, fields) => {
    //             if (err) {
    //                 logger.error(rows);
    //                 cb(err, rows)
    //                 //next(err);
    //             } else {
    //                 logger.info(rows)
    //                 cb(null, rows)
    //             }
    //         });
    //     } catch (ex) {
    //         next(ex);
    //     }
    // }

}

module.exports = Queryhandler