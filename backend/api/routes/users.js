var express = require("express");
var userModel = require("../models/user");
var router = express.Router();
const bcrypt = require("bcrypt");

function checkEmail(req, res, next) {
  var email = req.body.Email;
  var checkexitemail = userModel.findOne({ email: email }).exec(); // Execute the query

  checkexitemail
    .then((data) => {
      // Handle the promise
      if (data) {
        return res.status(200).json({
          message: "Email Already Exists",
          results: data,
          flag: true,
        });
      }
      next();
    })
    .catch((err) => {
      console.error(err); // Log any errors
      next(err); // Pass errors to the error handling middleware
    });
}

/* GET users listing. */
router.get("/", async function (req, res, next) {
  var userDetails = new userModel({
    name: "shrinidhi d",
    email: "shrinidhi@gmail.com",
    password: "shrinidhi_@123",
  });
  // Using async/await
  try {
    const savedDocument = await userDetails.save();
    console.log("Document saved:", savedDocument);
    res.render("index", { title: "User Data Inserted" });
  } catch (error) {
    console.error("Error saving document:", error);
  }
});

router.post("/register", checkEmail, function (req, res, next) {
  bcrypt.hash(req.body.Password, 10, function (err, hash) {
    if (err) {
      res.status(400).json({
        msg: "Something Wrong, Try Later!",
        results: err,
        flag: false,
      });
    } else {
      var userDetails = new userModel({
        name: req.body.Name,
        email: req.body.Email,
        password: hash,
        role:"Author"
      });

      userDetails
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User added successfully",
            results: result,
            flag: false,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    }
  });
});

router.post("/login", function (req, res, next) {
  var email = req.body.Email;
  userModel
    .find({ email: email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(200).json({
          message: "User not exist for the credentials provided",
          results: "",
          flag: false,
        });
      } else {
        bcrypt.compare(
          req.body.Password,
          user[0].password,
          function (err, result) {
            if (err) {
              res.json({
                message: "Auth Failed",
                results: "",
                flag: false,
              });
            }
            if (result) {
              res.status(200).json({
                message: "User Login Successfully",
                results: user,
                flag: true,
              });
            } else {
              res.json({
                message: "Invalid credentials",
                results: "",
                flag: false,
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
});

module.exports = router;
