var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let kitchen_users = await models.KitchenUser.findAll();
    res.json({kitchen_users: kitchen_users});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.KitchenUser.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", kitchen_user:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let kitchen_user = await models.KitchenUser.findById(id);

    res.json({kitchen_user: kitchen_user});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.KitchenUser.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", kitchen_user:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.KitchenUser.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", kitchen_user:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
