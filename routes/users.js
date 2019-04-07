var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');
var bcrypt = require('bcryptjs');
var auth = require('connect-ensure-login').ensureLoggedIn;
var options = require('../config/options');
var NoStaff = require('../middlewares/NoStaff');

// STAFF not allow
// router.use(function(req, res, next){
//   if(req.user.role== models.User.STAFF){
//     req.flash('errors', 'You do not have permission to access that page!');
//     return res.redirect('/');
//   }
//   next();
// });

/* GET users. */ //async... await
router.get('/', auth('/auth/login'), async function(req, res, next) {
  let users = await models.User.findAll();
  res.render('users/list', {users: users});
});

router.post('/getData', auth('/auth/login'), async function(req, res, next) {
  let roles = options.ROLES;
  let users = await models.User.findAll();
  users.map(function(user, i){
    user.role = roles[user.role];
    return users;
  });
  res.json({data: users});
});

/* GET create user form. */
router.get('/create', NoStaff,auth('/auth/login'), function(req, res, next) {
    let roles = options.ROLES;
    res.render('users/create', {roles: roles});
});

/* POST create user form. */
router.post('/store', [
  check('name', 'Name must be at least 5 character!').isLength({min:5}),
  check('email', 'Email must be at least 5 character!').isLength({min:5}),
  check('password', 'Password must be at least 6 character!').isLength({min:6}),
  check('phone', 'Phone must be at least 8 character!').isLength({min:8}),
  check('role', 'Role must be at least 1 character!').isLength({min:1})
] , NoStaff, auth('/auth/login'),async function(req, res, next) {
  let formData = req.body;

  var userExists = await models.User.findAll({where:{[Op.or]: [{phone: formData.phone}, {email: formData.email}]} });
  if(userExists && userExists.length > 0){
    req.flash("errors", "Email or Phone number is already in use!");
    return res.redirect('/users/create');
  }

  const errors = validationResult(req);
  if(!errors.isEmpty){
    req.flash('errors', errors.array());
    return res.redirect('/users/create');
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(formData.password, salt);
  formData.password = hash;

  let result = await models.User.create(formData);

  if(result){
    req.flash('infos', 'Successfully submit user!');
    return res.redirect('/users');
  }
});

/* GET edit user form. */
router.get('/:id/edit', auth('/auth/login'), async function(req, res, next) {
  let id = req.params.id;
  let roles = options.ROLES;

  let user = await models.User.findById(id);
  res.render('users/edit', {user: user, roles: roles});
});

/* POST update user form. */
router.post('/:id/update', async function(req, res, next){
  let id = req.params.id;
  let formData = req.body;

  let result = await models.User.update(formData, {where: {id:id}});

  if(result){
    req.flash('infos', 'Successfully update user!');
    res.redirect('/users');
  }
});

/* GET delete user form. */
router.get('/:id/delete', auth('/auth/login'), async function(req, res, next){
  let id = req.params.id;
  let result = await models.User.destroy({where:{id:id}});

  if(result){
    req.flash('infos', 'Successfully delete user!');
    res.redirect('/users');
  }
});

/* GET Profile user form. */
router.get('/profile', auth('/auth/login'), async function(req, res, next) {
  let roles = options.ROLES;

  res.render('users/profile', {user: req.user, roles: roles});
});

/* POST update user form. */
router.post('/profile', auth('/auth/login'), async function(req, res, next) {
  let id = req.user.id;
  let formData = req.body;

  if(formData.new_password){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(formData.password, salt);
    formData.new_password = hash;
  }

  let result = await models.User.update(formData, {where:{id:id}});

  if(result){
    res.redirect('/users/profile');
  }
});

module.exports = router;