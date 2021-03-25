const express = require("express");
const router = express.Router();
const passwordUtils = require("../auth/passwordUtils");
const passport = require("passport");
const opDB = require("../db/OpTaskDB");

// handles login requests
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ loginStatus: false });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({ loginState: user.username });
    });
  })(req, res, next);
});

//handles register requests
router.post("/register", (req, res, next) => {
  const saltHash = passwordUtils.generatePassword(req.body.userPassword);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  opDB.saveNewUser({
    username: req.body.userEmail,
    hash: hash,
    salt: salt,
  });
  res.send({ registered: true });
});

router.get("/isLoggedIn", (req, res, next) => {
  const isLoggedIn = req.isAuthenticated();
  res.send({isLoggedIn: isLoggedIn});
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.send({ logout: true });
});

module.exports = router;