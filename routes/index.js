var express = require('express');
const passport = require('passport');
const authenticated = require('../middleware/authenticated');
var router = express.Router();

router.get('/', authenticated, function(req, res, next) {
  res.render('index', { title: 'Express', username: req.user.username });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}))

router.post('/logout', function(req, res, next) {
  req.logOut();
  res.redirect('/login');
})

module.exports = router;
