var express = require('express');
var router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/profile", isLoggedIn, (req, res, next) => {
res.render("profile.hbs", req.session.user)
})



module.exports = router;
