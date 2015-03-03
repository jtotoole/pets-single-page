var express = require('express');
var cors = require('cors');
var sqlite3 = require("sqlite3").verbose();
var app = express();
var bodyParser = require('body-parser');
var db = new sqlite3.Database("petulance.db");

app.use(cors());
app.use(bodyParser.json({extended: false}));

app.get('/pets', function(req, res) {
	//convert the pets object to an array
	db.all("SELECT * FROM pets", function(err, rows){
		if(err) { throw err; }
		res.json(rows);
	});
});

app.post('/pets', function(req, res){
	var name = req.body.name;
	var type = req.body.type;

	db.run("INSERT INTO pets (name, type) VALUES (?, ?)", name, type, function(err){
		if(err) { throw err; }
		var id = this.lastID;
		db.get("SELECT * FROM pets WHERE id = ?", id, function (err, row){
			if(err) { throw err; }
			res.json(row);
		});
	});
});

app.put('/pets/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var type = req.body.type;
	
	db.run("UPDATE pets SET name = ?, type = ? WHERE id = ?", name, type, id, function(err){
		if(err) { throw err; }
			db.get("SELECT * FROM pets WHERE id = ?", id, function (err, row){
			if(err) { throw err; }
				res.json(row);	
		});
	});
});

app.delete('/pets/:id', function (req, res){
	var id = req.params.id;
	db.run("DELETE FROM pets WHERE id = ?", id, function(err){
		if(err) { throw err; }	
		res.json({deleted: true});
	});
});

app.listen(3000);
console.log("Listening on port 3000");