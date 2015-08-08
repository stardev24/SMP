var Twitter = require('twitter');
var userDetailsUtil = require("./utils/userDetailsUtils");
var Q = require('q');
var User = require('./user');
var makePromise = require("make-promise")
exports.postTweetToTwitter = function(req,res){
  var userId = req.body.userId;
  var tweetMessage = req.body.tweetMessage;
  var userDetailsTemp = []
  var promise = makePromise(function(cb) {
          User.findById(userId, function(err, userDetails){
                if(err){
                  cb(err);
                }else{
                  cb(userDetails) 
                }
          })      
    });
    promise.then(function(data){
      userDetailsTemp.push(data.twitter)
    },function(err){
      console.log("err after promise >>",err)
        var client = new Twitter({
          consumer_key: 'XXXXXXXXXXX',
          consumer_secret: 'XXXXXXXXXXXXXXX',
          access_token_key: err.twitter.access_token,
          access_token_secret:err.twitter.refresh_token
        });
        var params = {status:tweetMessage};
        client.post('statuses/update', params,function(error, tweet, response){
          if(error) {
            console.log("error >>",error);
          };
          console.log(tweet);  // Tweet body. 
          console.log(response);  // Raw response object. 
        });
        res.status(201);
        res.send("post for twitter is successfully done");
        res.end();
    })
}

