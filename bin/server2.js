var data = require('./bdd_data.js');
var express = require("express");
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require("http");
var server = http.createServer(app)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Listen to port 3000 
server.listen(3000);
function dataCallback(res) {
    return function(err, data) {
        if (err) {
            res.send({error : err});
        } else {
			// Il serait intéressant de fournir une réponse plus lisible en
			// cas de mise à jour ou d'insertion...
            res.send(data);
        }
    }
}

app.get('/user', function (req, res) {
        console.log(req.body);
    console.log("salut");
	data.getuser(req.body, dataCallback(res));
});

app.post('/user', function(req, res) {
    console.log(req.body);
	data.adduser(req.body, dataCallback(res));
});
app.put('/user', function(req, res) {
    console.log(req.body);
	data.updateuser(req.params.id, req.body, dataCallback(res));
});

app.delete('/user', function(req, res) {
    console.log(req.body);

	data.updateuser(req.params.id, dataCallback(res));
});


app.get('/applet/done', function(req, res) {
	data.getappletdone(req.params.id, dataCallback(res));
});

app.get('/applet', function(req, res) {
	data.getapplet(dataCallback(res));
});

app.delete('/applet', function(req, res) {
	data.deleteapplet(req.params.id, dataCallback(res));
});

app.post('/applet', function(req, res) {
	data.createapplet(req.body, dataCallback(res));
});

app.put('/applet', function(req, res) {
	data.updateapplet(req.params.id, req.body, dataCallback(res));
});







app.get('/domain', function(req, res) {
	data.getdomain(dataCallback(res));
});

app.delete('/domain', function(req, res) {
	data.deletedomain(req.params.id, dataCallback(res));
});

app.post('/domain', function(req, res) {
	data.createdomain(req.body, dataCallback(res));
});

app.put('/domain', function(req, res) {
	data.updatedomain(req.params.id, req.body, dataCallback(res));
});





