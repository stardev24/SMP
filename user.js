var mongoose = require('mongoose')

// create a user model
var User = mongoose.model('User', {
	localLogin:{
		email:String,
		password:String,
		firstName:String,
		lastName:String
	},
	facebook:{
		id:String,
		access_token:String,
		email:String,
		name:String,
		displayName:String
	},
	twitter:{
		id:String,
		access_token:String,
		refresh_token:String,
		name:String,
		displayName:String
	}
});


module.exports = User;