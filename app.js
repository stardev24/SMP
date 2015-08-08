// dependencies
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var path = require('path');
//var config = require('./oauth.js');
var cors = require('cors')
var User = require('./user.js');
var mongoose = require('mongoose');
var passport = require('passport');
var auth = require('./authentication.js');
var localLoginAndSignUp = require('./localLoginAndSignUp');
var postTweet = require("./postTweet")

// connect to the database
mongoose.connect('mongodb://localhost/fbTwitter');

var app = express();
var request = require('request');

//CORS implementation

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  //app.use(cors());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'my_test' }));
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(app.router);
  app.use(require('express-promise')());
  app.use(express.static(__dirname + '/public'));

});

// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);
app.get('/account', ensureAuthenticated, function(req, res){
  console.log("coming to twitter >>")
  User.findById(req.session.passport.user, function(err, user) {
    if(err) { 
      console.log(err); 
    } else {
      res.render('account', { user: user});
    }
  })
})
app.post('/register',localLoginAndSignUp.register);
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    //res.send("success >>>")
    res.redirect('/account');
  });
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
  });
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
  });
app.get('/callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    //res.send("success with twitter >>");
    res.redirect('/account')
    //res.redirect('/account');
  });
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.post('/twitter/post/status',postTweet.postTweetToTwitter);
// port
app.listen(9999,'localhost');
console.log("running at 9999")
// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = app
