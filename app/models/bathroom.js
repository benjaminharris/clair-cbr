var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var BathroomSchema	= new Schema({
	uuid:String,
	name:String,
	openDate:Date,
	closeDate:Date,
	isOccupied:Boolean
});

module.exports = mongoose.model('Bathroom', BathroomSchema);