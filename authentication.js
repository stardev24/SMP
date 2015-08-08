var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('./user')
var _ = require('underscore');

passport.serializeUser(function(user, done) {
  console.log("checking serializeUser >>",user)
  if(user[0] = -1){
    console.log("serializeUser if conditon >>")
    console.log('serializeUser: ' + user._id)
    done(null, user._id);
  }else{
    console.log('serializeUser: ' + user[0]._id)
    done(null, user[0]._id);    
  }
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        console.log("deserialize user >>",user[0]);
        if(!err) done(null, user);
        else done(err, null);
    })
});

/*module.exports = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  User.findOne({ oauthID: profile.id }, function(err, user) {
    if(err) { console.log(err); }
    if (!err && user != null) {
      done(null, user);
    } else {
      var user = new User({
        oauthID: profile.id,
        name: profile.displayName,
        created: Date.now()
      });
      user.save(function(err) {
        if(err) { 
          console.log(err); 
        } else {
          console.log("saving user ...");
          done(null, user);
        };
      });
    };
  });
}
));*/

//This is for twitter
passport.use(new TwitterStrategy({
   consumerKey: "eeBkuWJbkeiY8bJAVAcKFOK0e",
   consumerSecret: "jqlkBtp4nJNjdp9b00kAXLwOjMVWho6MYYnWBu6Jea3tdRCtbx",
   callbackURL: "http://localhost:9999/callback"
 },
 function(accessToken, refreshToken, profile, done) {
  console.log("profile is >>",profile);
   console.log("OATHaccessToken is >>",accessToken);
   console.log("OATHaccessToken secret is >>",refreshToken);
 User.findOne({ oauthID: profile.id }, function(err, user) {
console.log("user details is >>",user);
   if(err) { console.log("error is >>",err);}
   if (!err && user != null) {
     done(null, user);
   } else {
     var twitterUser = new User();
     twitterUser.twitter.id = profile.id;
     twitterUser.twitter.access_token = accessToken;
     twitterUser.twitter.refresh_token = refreshToken;
     //twitterUser.twitter.email = profile. //Email i am not fiding...need to ask
     twitterUser.twitter.name = profile.username;
     twitterUser.twitter.displayName = profile.displayName;
     twitterUser.save(function(err,user) {
       if(err) { 
         //console.log("error is >>",err); 
       } else {
         //console.log("saving user ...",user);
         done(null, user);
         return user;
       };
     });
   };
 });
}
));

//This is for local login
passport.use(new LocalStrategy(function(username, password, done) {
  console.log("username is ?>>",username);
  console.log("password is >>",password);
    User.find({localLogin : { $exists : true }}, function(err, user) {
      console.log("user is >>>>",err);
      console.log("user is >>>>",user);
      if (err) {
        return done(err);
      }else if (!err){
        var localLoginArrayOfUsers = _.pluck(user,'localLogin');
        var resultsArray = _.where(localLoginArrayOfUsers,{email:username,password:password});
        if(resultsArray.length >= 1){
          console.log("we r in success block >>>",user)
            return done(null, user);
        }else{
          return done(null,false)
        }        
      }else if (!user) {
        return done(null, false);
      }
    });
}));
