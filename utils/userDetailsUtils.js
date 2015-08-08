var request = require("request");
var Q = require("q");
var mongoose = require('mongoose')
var User = require('../user')
module.exports = {
	getUserDetails:function(getUserId) {
		console.log("we are in getUserDetails >>",getUserId);
		return 
	    User.findById(getUserId, function(err, userDetails){
	        if(err){
	        	return err;
	        }else{
	        	console.log("user userDetails >>",userDetails)
	        	return userDetails
	        }
	    }).then(function(data){
	    	//console.log("working fine.........................")
	    })

	}
}