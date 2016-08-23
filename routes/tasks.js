var express = require('express');
var router = express.Router();

/* GET tasks - apply filter parameters as passed in via query string */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('tasks');

	var filter = {};

	if(req.query.user) filter.user = req.query.user;
    if(req.query.category) filter.category = req.query.category;
    if(req.query.type) filter.type = req.query.type;
    if(req.query.complete=="false") 
        filter.complete = {$ne: true};
    else if(req.query.complete)
        filter.complete = true;

    collection.find(filter, {}, function(e,docs){
        res.json(docs);
    });
});	

/* POST new task */
router.post('/', function (req, res) {
    var db = req.db;
    var collection = db.get('tasks');

    console.log("Received id: "+req.body.id+" category:"+req.body.category+" type:"+req.body.type);
	
    collection.insert(req.body);
	res.json({message: "Task created"});
});

/* POST updated task */
router.post('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('tasks');
    var filter = {id: req.params.id};
        
    console.log("For update: ID: "+req.params.id);
    console.log("Received category:"+req.body.category+" type:"+req.body.type+" complete:"+req.body.complete);
    
    collection.find(filter,{},function(e,docs){
        var oldDoc = docs[0];
        if(req.body.type) oldDoc.type = req.body.type;
        if(req.body.title) oldDoc.title = req.body.title;
        if(req.body.complete) oldDoc.complete = req.body.complete;

        // Store proper boolean value
        if(oldDoc.complete=="true") oldDoc.complete = true;
        if(oldDoc.complete=="false") oldDoc.complete = false;

        collection.update({id: req.params.id}, oldDoc); 
		res.json({message: "Task updated"});
    });
});

module.exports = router;