var express = require('express');
var router = express.Router();
var models = require('../../models');
var passport = require('passport');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
// var bcrypt = require('bcryptjs');//for backend
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

// Post register
router.post('/register', async function(req, res, next) {
    let formData = req.body;
    console.log(formData);

    var userExists = await models.User.findAll({where:{[Op.or]: [{phone: formData.phone}, {email: formData.email}]} });
    if(userExists && userExists.length > 0){
      return res.json({message: "Email address of phone is already in use!"});
    }
  
    //get salt for password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(formData.password, salt);
    formData.password = hash;
  
    let result = await models.User.create(formData);
    if(result) {
        result.password = null;
        res.json({message: "Success!", user:result});
    }else {
        res.json({message: "Something went wrong!"});
    }
    
});

/* POST login */
router.post('/login', function(req, res, next) {

    passport.authenticate('custom', {session: false},
    (err, user, info)=>{ //callback
        if(err || !user) {
            return res.status(400).json({
                message: info || 'Something is not right',
                user : user
            });
        }

        req.login(user, {session: false}, async (err) => {
            if(err) { res.send(err); }
            // generate a signed son web token with the contents of user object and return it in
            // 'base64:Cb+iFiV6Iz6Pk1A2rINvWzqUqzCJ13bXcN1uPXxSSWk='
            const token = jwt.sign({id: user.id, name:user.name}, 'base64:Cb+khinzawlwin1234567890=',
            {
                // algorithm: 'RS256',
                // expiresIn: 120,
                // subject: user.id
            });

            user = await models.User.findOne({ where: {id: user.id} });
            return res.json({user, token});
        });
    })(req, res);// end of passport anthenticate

}); //end

/* Logout */
router.post("/logout", function(req, res, next){
    req.logout();
    return res.json({success:true, message:"Logout success"});
});

/* GET profile */
router.get('/account', passport.authenticate('jwt', {session: false}), function(req, res, next) {

    return res.json({user:req.user});
}); //end

/* GET profile */
router.put('/account', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    let user_id = req.user.id;
    let formData = req.body;
    if(formData.password.length > 5){
        console.log(formData.length);
        //encrypt
        //get salt for password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(formData.password, salt);
        formData.password = hash;
    }else {
        delete formData.password;
    }
    let ok = await models.User.update(formData, {where: {id: user_id}});
    let user = await models.User.findOne(formData, {where: {id: user_id}});

    return res.json({user:user});
}); //end

module.exports = router;