var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let kitchens = await models.Kitchen.findAll();
    res.json({kitchens: kitchens});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Kitchen.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", kitchen:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let kitchen = await models.Kitchen.findById(id);

    res.json({kitchen: kitchen});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Kitchen.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", kitchen:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Kitchen.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", kitchen:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
