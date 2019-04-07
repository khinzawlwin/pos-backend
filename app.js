require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;//strategy for backend
var CustomStrategy = require('passport-custom').Strategy;//strategy for frontend
var bcrypt = require('bcryptjs');
var MySQLStore = require('express-mysql-session')(session);
var cors = require('cors');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var cityRouter = require('./routes/cities');
var townshipRouter = require('./routes/townships');
var categoryRouter = require('./routes/categories');
var productRouter = require('./routes/products');
var models = require('./models');

// API
var categoryApiRouter = require('./routes/api/categories');
var kitchenApiRouter = require('./routes/api/kitchens');
var productApiRouter = require('./routes/api/products');
var tableApiRouter = require('./routes/api/tables');
var customerApiRouter = require('./routes/api/customers');
var userApiRouter = require('./routes/api/users');
var authApiRouter = require('./routes/api/auth');
var orderApiRouter = require('./routes/api/orders');
var reportApiRouter = require('./routes/api/reports');
var kitchenOrderApiRouter = require('./routes/api/kitchenOrders');
var kitchenOrderTranApiRouter = require('./routes/api/kitchenOrderTrans');
var custDemandApiRouter = require('./routes/api/customerDemands');
var kitchenUserApiRouter = require('./routes/api/kitchenUsers');
var supplierApiRouter = require('./routes/api/suppliers');
var purchaseApiRouter = require('./routes/api/purchases');
var dashboardApiRouter = require('./routes/api/dashboard');

var app = express();

//jwt
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'base64:Cb+khinzawlwin1234567890=';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("jwt");
    console.log(jwt_payload);
    models.User.findOne({where:{id: jwt_payload.id}}).then(function(user) {
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    })
    .catch(function(err){
      return done(err, false);
    });
}));

//for frontend login
passport.use('custom', new CustomStrategy(
  function(req, done) {
    // Do your custom user finding logic here, or set to false based on req object
    models.User.findOne({where:{ phone: req.body.phone }}).then((user)=>{
      if (!user) {
        // console.log("user not found!");
        return done(null, false, 'User not found.');
      }

      // compare password
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        console.log("password not match!");
        return done(null, false, { message: 'Incorrect password.' });
      }
      // console.log("everything ok");
      return done(null, user);
    });
  }
));

// for backend login
passport.use(new LocalStrategy({
  usernameField: 'email',
},
  function(email, password, done) {
    models.User.findOne({where:{ email: email }}).then((user)=>{
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // check if user is customer
      if(user.role==models.User.CUSTOMER) {
        return done(null, false, 'System User not found.');
      }
      // compare password
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
  models.User.findById(id).then(user=>{
    done(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/backend');

var options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'khinzawlwin',
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}))

app.use(cors());
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  //user
  res.locals.user = req.user || null;
  //flash message to view
  res.locals.errors = req.flash('errors');
  res.locals.infos = req.flash('infos');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/cities', cityRouter);
app.use('/townships', townshipRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

// API
app.use('/api/categories', categoryApiRouter);
app.use('/api/kitchens', kitchenApiRouter);
app.use('/api/products', productApiRouter);
app.use('/api/tables', tableApiRouter);
app.use('/api/customers', customerApiRouter);
app.use('/api/users', userApiRouter);
app.use('/api/auth', authApiRouter);
app.use('/api/orders', orderApiRouter);
app.use('/api/reports', reportApiRouter);
app.use('/api/kitchen-orders', kitchenOrderApiRouter);
app.use('/api/kitchen-order-tran', kitchenOrderTranApiRouter);
app.use('/api/customer-demands', custDemandApiRouter);
app.use('/api/kitchen_users', kitchenUserApiRouter);
app.use('/api/suppliers', supplierApiRouter);
app.use('/api/purchases', purchaseApiRouter);
app.use('/api/dashboard', dashboardApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(err.status == 404){
    res.render('404');  
  }else{
    res.render('error');
  }
});

module.exports = app;
