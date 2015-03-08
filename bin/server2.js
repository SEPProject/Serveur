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

var setHeader = function(res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
}


// Listen to port 3000 
server.listen(3000);
function dataCallback(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {
			// Il serait intéressant de fournir une réponse plus lisible en
			// cas de mise à jour ou d'insertion...

            if (data.insertId != 0){
                res.send("insertId : " + data.insertId + "\n");
            }else{
                res.send(data);

            }
            //res.status(status).send("insertId : " + data.insertId + "\n");
            }
    }
}
//Fonction par id ! renvoie [{"id":45,"email":"salut","login":"bozo","passwordhashed":"guizmo","showEmail":n
app.get('/user', function (req, res, err) {

    	if ('undefined' == typeof req.body.id) {
    		res.statusCode=400;
    		res.send({error : "Pas d'ID envoyé " });
    	}
    	else {
	        data.getuser(req.body, dataCallback(res));
    	}
});

//fonctionne ajoute l'utilisateur dans la db (voir pour le retour)
app.post('/user', function(req, res) {
	setHeader(res);
	if ('undefined' == typeof req.body.email || 'undefined' == typeof req.body.login || 'undefined' == typeof req.body.passwordhashed) {
    			res.statusCode=400;
    			res.send({error : "pas les bons paramètres envoyés "});
    	}
    	else {

	        data.adduser(req.body, dataCallback(res));
	        console.log("affiche res.data");
	        //console.log(res);
    	}
	//console.log(res);

});
//Modification fonctionne
app.put('/user', function(req, res, err) {
    console.log(req.body.id);
	setHeader(res);
	if ('undefined' == typeof req.body.id) {

			res.statusCode=400;
			res.send({error : "pas le bon id envoyé  "});

	}
	else {
         	data.updateuser(req.params.id, req.body, dataCallback(res));
	}
});

app.delete('/user', function(req, res) {

	setHeader(res);
		if ('undefined' == typeof req.body.id) {

    			res.statusCode=400;
    			res.send({error : "pas le bon id envoyé  "});

    	}
    	else {
	            data.removeuser(req.params.id, dataCallback(res));
    	}
});

//Fonction renvoie tous les utilisateurs présents dans la db
app.get('/user/action', function (req, res) {
        console.log(req.body);
    console.log("salut");
	setHeader(res);
	data.getuser(req.body, dataCallback(res));
});



app.get('/applet/done', function(req, res) {
	setHeader(res);
	data.getappletdone(req.params.id, dataCallback(res));
});

app.get('/applet', function(req, res) {
	setHeader(res);
	data.getapplet(dataCallback(res));
});

app.delete('/applet', function(req, res) {
	setHeader(res);
	data.deleteapplet(req.params.id, dataCallback(res));
});

app.post('/applet', function(req, res) {
	setHeader(res);
	data.createapplet(req.body, dataCallback(res));
});

app.put('/applet', function(req, res) {
	setHeader(res);
	data.updateapplet(req.params.id, req.body, dataCallback(res));
});







app.get('/domain', function(req, res) {
	setHeader(res);
	data.getdomain(dataCallback(res));
});

app.delete('/domain', function(req, res) {
	setHeader(res);
	data.deletedomain(req.params.id, dataCallback(res));
});

app.post('/domain', function(req, res) {
	setHeader(res);
	data.createdomain(req.body, dataCallback(res));
});

app.put('/domain', function(req, res) {
	setHeader(res);
	data.updatedomain(req.params.id, req.body, dataCallback(res));
});



app.options('/applet',function(req,res,next){
	setHeader(res);
	next();
});

app.options('/user/action',function(req,res,next){
	setHeader(res);
	next();
});

app.options('/domain',function(req,res,next){
	setHeader(res);
	next();
});

app.options('/user',function(req,res,next){
	setHeader(res);
	next();
});
