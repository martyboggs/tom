var express = require('express');
var app = express();
var path = require('path');
var app = module.exports = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'lab8'
});

connection.connect();

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/query', function(req, res){
	switch (req.query.action) {
		case 'create':
			console.log(req.query);
			connection.query('INSERT INTO PRODUCTS (product_ID, product_name, product_descript, product_price, vendor_ID) VALUES (?, ?, ?, ?, ?)', [
				req.query.id,
				req.query.name,
				req.query.description,
				req.query.price,
				req.query.vendor
			], function (error, results, fields) {
				if (error) throw error;
				return res.send(results);
			});
		break;
		case 'read':
			connection.query('SELECT * FROM PRODUCTS', function (error, results, fields) {
				if (error) throw error;
				return res.send(results);
			});
		break;
		case 'update':
			connection.query('UPDATE PRODUCTS SET product_name = ? WHERE product_ID = ?', [req.query.name, req.query.id], function (error, results, fields) {
				if (error) throw error;
				return res.send(results);
			});
		break;
		case 'delete':
			connection.query('DELETE FROM PRODUCTS WHERE product_ID = ?', [req.query.id], function (error, results, fields) {
				if (error) throw error;
				return res.send(results);
			});
	break;
	}
});

app.get('/404', function(req, res, next){
	next();
});

app.get('/403', function(req, res, next){
	var err = new Error('not allowed!');
	err.status = 403;
	next(err);
});

app.get('/500', function(req, res, next){
	next(new Error('error!'));
});

console.log('running on localhost:3000');
app.listen(3000);
