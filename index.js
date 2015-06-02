var express    = require('express'),
		request    = require('request'),
		bodyParser = require('body-parser'),
		async = require('async');
    app        = express();

app.use(bodyParser.json());

// for slack
app.post('/', function(req, res){
	res.send({text: "why is this repeating"});
	//getHN(res);
});

// for testing purposes
app.get('/', function(req, res){
	getHN(res);
});

var server = app.listen(process.env.PORT || 3000, function() {
	var host = server.address().address;
  var port = server.address().port;

	console.log('Start slacking now at http://%s:%s', host, port);
});

function getHN(res) {
	async.waterfall([
		function(callback) {
			request.get('https://hacker-news.firebaseio.com/v0/topstories.json', 
				function(err, r, body) {
					body = JSON.parse(body);
					var random = Math.floor(Math.random() * (body.length - 1));
					callback(null, body[random])
				}
			);
		},
		function(id, callback){
			request.get('https://hacker-news.firebaseio.com/v0/item/' + id + '.json',
				function(err, r, body) {
					// Parse out the valuable information.
					body = JSON.parse(body);

					if(body.url == "")
						body.url = "https://news.ycombinator.com/item?id=" + id;

					var message = {}

					message.attachments = [
						{
							"fallback": "Something went wrong :(\nWe know you're bored... try the command again maybe?",
							"pretext": "Here's something to look at while you're bored:",
							"title": body.title,
							"title_link": body.url,
							"text": body.text
						}
					]

					message = {
						"text": "Slacking test",
						"attachments": [
							{
								"fallback": "Something went wrong :(\nWe know you're bored... try the command again maybe?",
								"pretext": "Here's something to look at while you're bored:",
								"title": body.title,
								"title_link": body.url,
								"text": body.text
							}
						]
					}

					res.send(message);
					callback(null, 'done');
				}
			);
		}
	], function(err, result) {
		if(err)
			console.log(err);
		else
			console.log("Relieved boredom.");
	});
}
