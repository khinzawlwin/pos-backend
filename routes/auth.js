var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var { check, validationResult } = require('express-validator/check');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

router.get('/login', async function(req, res, next) {

    res.render('auth/login', {layout: 'layouts/auth'});
});

router.post('/login', passport.authenticate('local', 
{ 
successRedirect: '/',
failureRedirect: '/auth/login',
failureFlash: true 
}
));

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/auth/login');
});

/* GET forgot_password form. */
router.get('/forgot_password', function(req, res, next) {
  
  res.render('auth/forgot_password',{layout:'layouts/auth'});
});

router.post('/forgot_password', function(req, res, next) {
  
  res.send('respond with a resource');
});


module.exports = router;
