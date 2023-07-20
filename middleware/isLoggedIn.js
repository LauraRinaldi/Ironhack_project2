const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      req.session.out = true
         return res.redirect("/");
      }
      next();
}

module.exports = isLoggedIn