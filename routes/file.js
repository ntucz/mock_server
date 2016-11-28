var fs = require("fs");
var path = require('path');

exports.read= function(res, fileName, cp){
	var filePath = path.join(__dirname, "../public/config/"+fileName);
	var output = [];
	fs.exists(filePath, function(exists) {  
	    if(exists){
	    	fs.readFile(filePath, function (err, data) {
                if (err) {
                	console.error(err);
                } else {
                    output.push(data);
                }
                cp(res, output);
            });
	    } else {
	    	console.log(filePath+' not existed.');
	    	res.end();
	    }
	});
};