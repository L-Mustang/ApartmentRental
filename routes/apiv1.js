const express = require("express")
const assert = require("assert")
const Apartments = require("../models/apartments");
const Apartment = require("../models/apartment");
const Reservation = require("../models/reservation");
const router = express.Router()
const jwt = require("../helpers/jwt")
const logger = require("tracer").colorConsole();
const db = require("../db/mysql-connector");

const Queryhandler = require("../helpers/queryhandler")
const _queryhandler = new Queryhandler()


const _apartments = new Apartments();

var token;

// Check voor alle endpoints het token
router.all("*", (req, res, next) => {
  //console.log("Token: "+ req.header("x-access-token"))
  assert(
    typeof req.header("x-access-token") == "string",
    "Token is not a string!"
  );

  token = req.header("x-access-token") || "";


  jwt.decodeToken(token, (err, payload) => {
    if (err) {
      console.log("Error handler: " + err.message);
      next(err);
    } else {
      next();
    }
  });
});

//
// Get all apartments
//
router.get("/apartments", (req, res, next) => {

  _queryhandler.query1((err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });

});

//
// Post new apartment
//
router.post("/apartments", (req, res, next) => {
  //const apartment = req.body || {};

  assert(typeof req.body.description === "string", "Description is not a string!");
  assert(typeof req.body.street_address === "string", "StreetAddress is not a string!");
  assert(typeof req.body.postal_code === "string", "PostalCode is not a string!");
  assert(typeof req.body.city === "string", "City is not a string!");
  assert(typeof req.body.user_id === "string", "UserId is not a string!");

  const apartment = new Apartment(req.body.description, req.body.street_address, req.body.postal_code, req.body.city, req.body.user_id)

  logger.info(apartment)

  _queryhandler.query2(apartment, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

//
// Get apartment by id
//
router.get("/apartments/:id", (req, res, next) => {
  const id = req.params.id;

  _queryhandler.query3(id, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });

});

//
// Update apartment by id
//
router.put("/apartments/:id", (req, res, next) => {
  const apartmentId = req.params.id;

  assert(typeof req.body.description === "string", "Description is not a string!");
  assert(typeof req.body.street_address === "string", "StreetAddress is not a string!");
  assert(typeof req.body.postal_code === "string", "PostalCode is not a string!");
  assert(typeof req.body.city === "string", "City is not a string!");
  assert(typeof req.body.user_id === "string", "UserId is not a string!");

  const apartment = new Apartment(req.body.description, req.body.street_address, req.body.postal_code, req.body.city, req.body.user_id)

  console.log(apartmentId, apartment)

  _queryhandler.query4(apartment, apartmentId, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(apartment);
    }
  });
});

//
// Delete apartment by id, if owned by token
//
router.delete("/apartments/:id", (req, res, next) => {
  const apartmentId = req.params.id;

  logger.debug("Token: ", token)

  _queryhandler.query5(apartmentId, token, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

//
// Post new reservation
//
router.post("/apartments/:id/reservations", (req, res, next) => {
  const apartmentId = req.params.id;

  assert(typeof req.body.start_date === "string", "StartDate is not a string!");
  assert(typeof req.body.end_date === "string", "EndDate is not a string!");
  assert(typeof req.body.status === "string", "Status is not a string!");

  const reservation = new Reservation(req.body.start_date, req.body.end_date, req.body.status, null, apartmentId)

  logger.info(reservation)

  _queryhandler.query6(reservation, token, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);

    }
  });
});

//
// Get reservation by apartment id
//
router.get("/apartments/:id/reservation", (req, res, next) => {
  const id = req.params.id;
  _queryhandler.query7(id, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });

});

//
// Get reservation by apartment id and reservation id
//
router.get("/apartments/:id/reservation/:id2", (req, res, next) => {
  const id = req.params.id;
  const id2 = req.params.id2;
  _queryhandler.query8(id, id2, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });

});

//
// Update reservation status by apartment id and reservation id, if owned by token
//
router.put("/apartments/:id/reservation/:id2", (req, res, next) => {
  const apartmentId = req.params.id;
  const reservationId = req.params.id2;

  logger.debug("Token: ", token)

  assert(typeof req.body.status === "string", "Description is not a string!");

  const status = req.body.status

  _queryhandler.query9(status, apartmentId, reservationId, token, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(status);
    }
  });

});

// Fall back, display some info
router.all("*", (req, res) => {
  res.status(200);
  res.json({
    description: "Apartments API version 1"
  });
});

module.exports = router;