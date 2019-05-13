const express = require("express")
const assert = require("assert")
const router = express.Router()
const jwt = require("../helpers/jwt")

const _apartments = new Apartments();
const saltRounds = 10;

// Check voor alle endpoints het token
router.all("*", (req, res, next) => {
  assert(
    typeof req.headers["x-access-token"] == "string",
    "token is not a string!"
  );

  const token = req.header("X-Access-Token") || "";

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
  _apartments.readAll((err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

//
// Get movie by id
//
router.get("/apartments/:id", (req, res, next) => {
  const id = req.query.id || "";

  _apartments.read(id, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

//
// Post new movie
//
router.post("/apartments", (req, res, next) => {
  const apartment = req.body || {};

  _apartments.create(apartment, (err, result) => {
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
    description: "Aparments API version 2"
  });
});

module.exports = router;