const express = require("express");
const assert = require("assert");
const router = express.Router();
const User = require("../models/users");
const db = require("../db/mysql-connector");
const bcrypt = require("bcryptjs");
const jwt = require("../helpers/jwt");

const saltRounds = 10;

// // Check token except for 'register' and 'login'
// router.all(/^(?!\/login|\/register).*$/, function(req, res, next) {
//   const token = req.header("X-Access-Token") || "";
//   console.log(token);

//   auth.decodeToken(token, (err, payload) => {
//     if (err) {
//       console.log("Error handler: " + err.message);
//       next(err);
//       //res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
//     } else {
//       next();
//     }
//   });
// });

//
// Register new user
//
router.post("/register", (req, res, next) => {
  try {
    // Validate with assert is string etc ..
    assert(typeof req.body.first_name  === "string", " is not a string!");
    assert(typeof req.body.last_name  === "string", " is not a string!");
    assert(typeof req.body.street_address  === "string", " is not a string!");
    assert(typeof req.body.postal_code  === "string", " is not a string!");
    assert(typeof req.body.city  === "string", " is not a string!");
    assert(typeof req.body.date_of_birth  === "string", " is not a string!");
    assert(typeof req.body.phone_number  === "string", " is not a string!");
    assert(typeof req.body.email === "string", "Email is not a string!");
    assert(typeof req.body.password === "string", "Password is not a string!");

    // Create new user object, hash password (do not store in db).
    // Throws err if no valid object can be constructed
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User(req.body.first_name, req.body.last_name, req.body.street_address, req.body.postal_code, req.body.city, req.body.date_of_birth, req.body.phone_number, req.body.email, hash);

    // Construct query object
    const query = {
      sql: "INSERT INTO `user`(email, password) VALUES (?,?)",
      values: [user.email, hash],
      timeout: 2000
    };

    // Perform query
    db.query(query, (err, rows, fields) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        res.status(200).json(rows);
      }
    });
  } catch (ex) {
    next(ex);
  }
});

//
// Login with email / password
//
router.post("/login", (req, res, next) => {
  try {
    // Validate with assert is string etc ..
    assert(typeof req.body.password === "string", "Password is not a string!");
    assert(typeof req.body.email === "string", "email is not a string!");

    // Construct query object
    const query = {
      sql: "SELECT `password` FROM `user` WHERE `email`=?",
      values: [req.body.email],
      timeout: 2000
    };

    // Perform query
    db.query(query, (err, rows, fields) => {
      if (err) {
        next(err);
      } else {
        if (
          rows.length === 1 &&
          bcrypt.compareSync(req.body.password, rows[0].password)
        ) {
          token = jwt.encodeToken(req.body.email);
          res.status(200).json({ token: token });
        } else {
          next(new Error("Invalid login, bye"));
        }
      }
    });
  } catch (ex) {
    next(ex);
  }
});

// Fall back, display some info
router.all("*", (req, res, next) => {
  next(new Error("Unknown endpoint"));
});

module.exports = router;
