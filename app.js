// const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');

dotEnv.config();
require('./globals/global-module').initGlobalModules();

const { auth, helpers, express } = global;
const app = express();

helpers.connectDb();
require('./globals/global-model').initGlobalModels();

auth.setupTokenBaseAuth();
app.use(auth.passportInitialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
const users = require('./routes/users');
const products = require('./routes/products');
const campaigns = require('./routes/campaigns');
const searches = require('./routes/searches');

app.use('/', index);
app.use('/users', users);
app.use('/products', products);
app.use('/campaigns', campaigns);
app.use('/searches', searches);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

