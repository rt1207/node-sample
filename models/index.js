var mongoose = require('mongoose'),
	utils = require('connect').utils;

exports.PostModel = mongoose.model('Post',PostSchema);

var MovieSchema = new Schema({
	title:{type:String,required:true},
	// genre:{type:String,required:true},
	// title:{type:String,required:true},
	// display:{type:Boolean},
	// bc_url:{type}
	// released_at:{type:Date,default:Date.now}
	created_at:{type:Date,default:Date.now}
});

MovieSchema.methods.