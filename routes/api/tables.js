var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let tables = await models.Table.findAll();
    res.json({tables: tables});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Table.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", table:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let table = await models.Table.findById(id);

    res.json({table: table});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Table.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", table:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Table.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", table:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
