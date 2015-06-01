var express    = require('express'),
		request    = require('request'),
		bodyParser = require('body-parser'),
		async = require('async');
    app        = express();

app.use(bodyParser.json());

app.post('/', function(req, res){
	res.send(req.body);
});

app.get('/', function(req, res){
	getHN(res);
});

var server = app.listen(3000, function() {
	console.log('Serving on 3000.');
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

					res.send(message)
				}
			);
		}
	]);
}

function randomArticle(list){
	

}