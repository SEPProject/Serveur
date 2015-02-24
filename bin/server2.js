var data = require('./bdd_data.js');
var express = require("express");
var app = express();


var http = require("http");
var server = http.createServer(app)

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

    console.log("salut");
	data.getuser(req.body, dataCallback(res));



});


app.post('/user', function(req, res) {
 console.log(req.params);
 res.send('hi');

	data.adduser(req.body, dataCallback(res));
});
app.put('/user', function(req, res) {
	data.updateuser(req.params.id, req.body, dataCallback(res));
});

app.delete('/user', function(req, res) {
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





