var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

mongoose.connect("mongodb://192.168.0.100:27017/mockServer");

for(var m in models){ 
	mongoose.model(m,new Schema(models[m]));
}

module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
	}
};

var _getModel = function(type){ 
	return mongoose.model(type);
};