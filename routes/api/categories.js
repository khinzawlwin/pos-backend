var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let categories = await models.Category.findAll();
    res.json({categories: categories});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.Category.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", category:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let category = await models.Category.findById(id);

    res.json({category: category});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Category.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", category:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Category.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", category:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
