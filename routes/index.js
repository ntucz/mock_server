var express = require('express');
var router = express.Router();
var db = require('../database/dbHandel');
var file = require('./file');

router.route("/*/upload")
	.post(function(req, res) {
		var pathname = req.originalUrl;
		var moduleName = pathname.substring(1, pathname.lastIndexOf('/'));
		var fileName = moduleName + "_upload.json";
		file.read(res, fileName, fileCallBack);
	});

router.route("/*")
	.get(function(req, res) {
		var queryCon = getQueryCondition(req);
		var Module = db.getModel('module');
		Module.find(queryCon,'-_id data',function(err,doc){ 
			if(err){ 										
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200);
				if(!doc || doc.length === 0){
					var fileName = queryCon.moduleName + "_mock.json";
					file.read(res, fileName, fileCallBack);
				} else {
					var resArray = [];
					doc.forEach(function(model){
						resArray.push(JSON.parse(model._doc.data));
					});
					res.jsonp({data:resArray});
				}
			}
		});
	})
	.post(function(req, res) {
		var queryCon = getQueryCondition(req);
		var data = JSON.stringify(req.body);
		var Module = db.getModel('module');
		Module.find(queryCon, '-_id data', function(err, doc) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else if (doc && doc.length>0) {
				var update = {
					$set : {data : data}
				};
				var options = {upsert : true};
				Module.update(queryCon, update, options, function(err) {
					if (err) {
						console.log(err);
						res.status(500).send(err);
					} else {
						res.status(200).send({resultDesc:'ok'});
					}
				});
			} else {
				Module.create({
					moduleName : queryCon.moduleName,
					serviceID : queryCon.serviceID,
					data : data
				}, function(err, doc) {
					if (err) {
						console.log(err);
						res.status(500).send(err);
					} else {
						res.status(200).send({resultDesc:'ok'});
					}
				});
			}
		});
	})
	.delete(function(req, res) {
		var queryCon = getQueryCondition(req);
		var Module = db.getModel('module');
		Module.remove(queryCon, function(err){
		    if(err) {
				console.log(err);
				res.status(500).send(err);
		    } else {
		    	res.status(200).send({resultDesc:'ok'});
		    }
		});
	});


function fileCallBack(res, output){
	var result = {data:JSON.stringify(JSON.parse(output))};
	res.jsonp(result);
	//res.end(JSON.stringify(result));
}

function getQueryCondition(req){
	var pathname = req.originalUrl;
	var queryCon = {};
	if(req.query.id!==null && req.query.id!==undefined){
		queryCon = {moduleName:pathname.substring(1, pathname.indexOf('?')), 
					serviceID:req.query.id};
	} else if(pathname.indexOf('?')>-1){
		queryCon = {moduleName:pathname.substring(1, pathname.indexOf('?'))};
	}
	return queryCon;
}
module.exports = router;
