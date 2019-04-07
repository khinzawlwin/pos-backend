var models = require('../models');

var NoWaiter = function(req, res, next) {
  if(!req.user || req.user.role== models.User.WAITER){
    req.flash('errors', 'You do not have permission to access that page!');
    return res.redirect('/');
  }
  next();
};

module.exports = NoWaiter;