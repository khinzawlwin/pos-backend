var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let cities = await models.City.findAll();
    res.render('cities/list', {cities: cities});
});

router.post('/getData', async function(req, res, next) {
    let cities = await models.City.findAll();

    res.json({data: cities});
});

router.get('/create', function(req, res, next) {

    res.render('cities/create');
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.City.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        req.flash('errors', errors.array());
        return res.redirect('/cities/create');
    }

    if(result) {
        req.flash('infos', 'Successfully submit your city');
        return res.redirect('/cities')
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let city = await models.City.findById(id);

    res.render('cities/edit', {city: city});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.City.update(formData, {where:{id:id}});

    if(result) {
        req.flash('infos', 'Successfully update your city');
        res.redirect('/cities');
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.City.destroy({where:{id:id}});

    if(result) {
        req.flash('infos', 'Successfully delete your city');
        res.redirect('/cities');
    }
});

module.exports = router;
