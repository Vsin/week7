var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var base64 = require('./base64.js');
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/', function(req, res){
  var longUrl = req.body.url;
  var id = base64.encode(longUrl);
	var shortUrl = config.webhost + id;
	
	client.set(id, longUrl, function(err, reply) {
		//console.log(err);
		//console.log(reply);
	});

	res.send({'shortUrl': shortUrl});

});

app.get('/:link_id', function(req, res){

  var base64Id = req.params.link_id;

  var id = base64.decode(base64Id);
	

	res.writeHead(302, {'Location': id});
	res.end();
});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
