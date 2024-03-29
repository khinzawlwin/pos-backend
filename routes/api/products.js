var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var multer  = require('multer');
var thumbnailUpload = multer({ dest: 'public/uploads/' });

const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    // let where = {is_active: 1};
    let products = await models.Product.findAll({
        // where: where,
        include:[
            models.Category
        ]
    });
    res.json({products: products});
});

// GET for POS
router.get('/pos', async function(req, res, next) {
    let params = req.query;
    let where = {};
    where.is_active = 1;
    if(params.q) {
        where.name = {[Op.like]: '%'+params.q+'%'};
    }
    if(params.code) {
        where.code = params.code;
    }
    if(params.category) {
        where.category_id = params.category;
    }

    // let where = {is_active: 1};
    let products = await models.Product.findAll({
        where: where,
        include:[
            models.Category
        ],
        limit: 48,
    });
    res.json({products: products});
});

// GET for Purchase
router.get('/buy', async function(req, res, next) {
    let params = req.query;
    let where = {};
    where.is_raw = 1;
    if(params.q) {
        where.name = {[Op.like]: '%'+params.q+'%'};
    }
    if(params.code) {
        where.code = params.code;
    }
    if(params.category) {
        where.category_id = params.category;
    }

    // let where = {is_active: 1};
    let stocks = await models.Product.findAll({
        where: where,
        include:[
            models.Category
        ],
        limit: 48,
    });
    res.json({stocks: stocks});
});

router.post('/store', thumbnailUpload.single('thumbnail'),async function(req, res, next) {
    console.log(req.file, req.body);
    let formData = req.body;
    let photo = req.file;
    if(photo) {
        formData.thumbnail = photo.filename;
    }

    let result = await models.Product.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", product:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let product = await models.Product.findById(id);

    res.json({product: product});
});

router.post('/:id/update', thumbnailUpload.single('thumbnail'),async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    console.log(formData);
    let photo = req.file;
    if(photo) {
        formData.thumbnail = photo.filename;
    }

    let result = await models.Product.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", product:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Product.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", product:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
