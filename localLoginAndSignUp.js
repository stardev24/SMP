var express = require('express');
var app = express();
var User = require('./user')
exports.register=function(req,res){
	console.log("coming >>>>>>>>>>>>>>",req.body)
	 firstName = req.body.firstName;
	 lastName  = req.body.lastName;
	 email = req.body.email;
	 password  = req.body.password;

	User.findOne({'localLogin.email':email},function(err,user){
		if(err){
			res.send("error in finding details of user ",err)
		}else if(user){
			res.send("user already exist in database..Try it with new one")
		}else{
			var newUser = new User();
			newUser.localLogin.firstName = firstName;
			newUser.localLogin.lastName = lastName;
			newUser.localLogin.email = email
			newUser.localLogin.password = password;
			newUser.save(function(err,accountDetails){
				if(!err){
					console.log("data status>>>",accountDetails);
					res.status(200);
					res.send("user details saved into our database");
				}else{
					res.send("problem in storing into databse >>",err);
				}
			})
		}
	})

};
exports.login = function(req,res){

}
