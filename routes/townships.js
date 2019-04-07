var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

/* GET home page. */
router.get('/', async function(req, res, next) {
    let townships = await models.Township.findAll();
    res.render('townships/list', {townships: townships});
});

router.post('/getData', async function(req, res, next) {
    let townships = await models.Township.findAll();

    res.json({data: townships});
});

router.get('/create', function(req, res, next) {

    res.render('townships/create');
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Township.create(formData);

    if(result) {
        return res.redirect('/townships')
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let township = await models.Township.findById(id);

    res.render('townships/edit', {township: township});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Township.update(formData, {where:{id:id}});

    if(result) {
        res.redirect('/townships');
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Township.destroy({where:{id:id}});

    if(result) {
        res.redirect('/townships');
    }
});

module.exports = router;
