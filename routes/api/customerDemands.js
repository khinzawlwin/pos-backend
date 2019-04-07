var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let demands = await models.CustomerDemand.findAll();
    res.json({demands: demands});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.CustomerDemand.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", demand:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let demand = await models.CustomerDemand.findById(id);

    res.json({demand: demand});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.CustomerDemand.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", demand:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.CustomerDemand.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", demand:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
