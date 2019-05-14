const express = require("express")
const assert = require("assert")
const Apartments = require("../models/apartments");
const Apartment = require("../models/apartment");
const router = express.Router()
const jwt = require("../helpers/jwt")

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
  // _apartments.readAll((err, result) => {
  //   if (err) {
  //     res.status(500).json(err.toString());
  //   } else {
  //     res.status(200).json(result);
  //   }
  // });

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

  assert(typeof req.body.description  === "string", "Description is not a string!");
  assert(typeof req.body.street_address  === "string", "StreetAddress is not a string!");
  assert(typeof req.body.postal_code  === "string", "PostalCode is not a string!");
  assert(typeof req.body.city  === "string", "City is not a string!");
  assert(typeof req.body.user_id  === "string", "UserId is not a string!");

  const apartment = new Apartment(req.body.description, req.body.street_address, req.body.postal_code, req.body.city, req.body.user_id)

  console.log(apartment)
  // _apartments.create(apartment, (err, result) => {
  //   if (err) {
  //     res.status(500).json(err.toString());
  //   } else {
  //     res.status(200).json(result);
  //   }
  // });

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

  // _apartments.read(id, (err, result) => {
  //   if (err) {
  //     res.status(500).json(err.toString());
  //   } else {
  //     res.status(200).json(result);
  //   }
  // });

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

  assert(typeof req.body.description  === "string", "Description is not a string!");
  assert(typeof req.body.street_address  === "string", "StreetAddress is not a string!");
  assert(typeof req.body.postal_code  === "string", "PostalCode is not a string!");
  assert(typeof req.body.city  === "string", "City is not a string!");
  assert(typeof req.body.user_id  === "string", "UserId is not a string!");

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

  console.log(token)

    _queryhandler.query5(apartmentId, token, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

// Fall back, display some info
router.all("*", (req, res) => {
  res.status(200);
  res.json({
    description: "Apartments API version 2"
  });
});

module.exports = router;