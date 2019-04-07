var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let categories = await models.Category.findAll();
    res.render('categories/list', {categories: categories});
});

router.post('/getData', async function(req, res, next) {
    let categories = await models.Category.findAll();

    res.json({data: categories});
});

router.get('/create', function(req, res, next) {

    res.render('categories/create');
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Category.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        req.flash('errors', errors.array());
        return res.redirect('/categories/create');
    }

    if(result) {
        req.flash('infos', 'Successfully submit your category');
        return res.redirect('/categories')
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let category = await models.Category.findById(id);

    res.render('categories/edit', {category: category});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Category.update(formData, {where:{id:id}});

    if(result) {
        req.flash('infos', 'Successfully update your category');
        res.redirect('/categories');
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Category.destroy({where:{id:id}});

    if(result) {
        req.flash('infos', 'Successfully delete your category');
        res.redirect('/categories');
    }
});

module.exports = router;
