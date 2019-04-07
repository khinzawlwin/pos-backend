var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let customers = await models.Customer.findAll();
    res.json({customers: customers});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Customer.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", customer:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let customer = await models.Customer.findById(id);

    res.json({customer: customer});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Customer.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", customer:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Customer.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", customer:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
