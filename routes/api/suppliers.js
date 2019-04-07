var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let suppliers = await models.Supplier.findAll();
    res.json({suppliers: suppliers});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Supplier.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", supplier:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let supplier = await models.Supplier.findById(id);

    res.json({supplier: supplier});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Supplier.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", supplier:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Supplier.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", supplier:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
