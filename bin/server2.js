var data = require('./bdd_data.js');
var express = require("express");
var token_table = require('./token_table.js');
var app = express();



var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require("http");
var server = http.createServer(app)

//ROUTES


//require('./routes/route-user.js')(app);






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

            if (data.insertId != 0 && 'undefined' != typeof data.insertId){

				var tokenToSend = token_table.add_token({id : data.insertId});
				if(tokenToSend != -1){
				    console.log(data);
					res.json({id : data.insertId,token : tokenToSend});
				}else{
					res.statusCode=500;
					res.send({error : data});
				}
            }else{
                res.send(data);

            }
            //res.status(status).send("insertId : " + data.insertId + "\n");
            }

    }
}

function dataExecute(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {
			// Il serait intéressant de fournir une réponse plus lisible en
			// cas de mise à jour ou d'insertion...

            if (data.length != 0  ){
				console.log("data"+data);
               // res.json(data);
				var tokenToSend = token_table.add_token(data);//METTRE LE BON ID DE CONNEXION

				if(tokenToSend != -1){
					res.json({token : tokenToSend});
				}else{
					res.statusCode=500;
					res.send({error : data});
				}

            }else{
				res.statusCode=400;
				res.send({error : err});
            }
            //res.status(status).send("insertId : " + data.insertId + "\n");
            }

    }
}
function datainscription(res) {
    return function(err, data) {
		if (err) {
		    if ('ER_DUP_ENTRY' == err.code){
		   		res.statusCode=410;
           		res.send({error : err});
		    }else{
				res.statusCode=500;
    			res.send({error : err});
		    }


        } else {

			    var token = token_table.add_token([{'id':data.insertId}]);
			    res.json({token : token});

		}


    }
}

app.post('/user', function(req, res) {
    console.log("test");
	setHeader(res);
	console.log(req.body);
	if ('undefined' == typeof req.body.email || 'undefined' == typeof req.body.login || 'undefined' == typeof req.body.passwordhashed) {
    			res.statusCode=400;
    			res.send({error : "pas les bons paramètres envoyés "});
    	}
    	else {

	        data.adduser(req.body, datainscription(res));
	        //console.log(res);
    	}
	//console.log(res);
	console.log("coucou");

});

app.put('/user', function(req, res, err) {

	setHeader(res);
	if ('undefined' == typeof req.body.token) {

			res.statusCode=400;
			res.send({error : "pas le bon id envoyé  "});

	}
	else {

	    	if ('undefined' != typeof req.body.passwordhashed) {
	             var id = token_table.find_id_from_token(req.body.token);
    	         if (id != -1){
 	                    data.updateuserpwd(id, req.body.login, req.body.email, req.body.passwordhashed, req.body.passwordhashedold, req.body, dataCallback(res));
    	         }else{
    	         res.statusCode=406;
    	         res.send({error : "vous n'êtes plus connecté"})
    	         }

        	}else {

	             var id = token_table.find_id_from_token(req.body.token);
    	         if (id != -1){
 	                    data.updateuser(id, req.body, dataCallback(res));
    	         }else{
    	         res.statusCode=406;
    	         res.send({error : "vous n'êtes plus connecté"})
    	         }

        	}

	}
});

app.delete('/user', function(req, res) {

	setHeader(res);
		if (('undefined' == typeof req.body.id)||('undefined' == typeof req.body.token)) {
				res.statusCode=400;
    			res.send({error : "pas le bon id envoyé  "});

    	}
    	else {
    	    if(req.body.token == 1){
	            data.removeuser(req.body.id, dataCallback(res));
	            }
	            else{
	            res.statusCode=402;
	            res.send({error : "vous n'avez pas les permissions"});
	            }
    	}
});

function datagetuser(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

             res.json(data);

            }

    }
}


app.get('/user', function(req, res) {

	setHeader(res);
		if ('undefined' == typeof req.param('token')) {
				res.statusCode=400;
    			res.send({error : "pas le bon id envoyé  "});

    	}
    	else {

    	         var id = token_table.find_id_from_token(req.param('token'));
    	         if (id != -1){
    	        data.infouser(id, datagetuser(res));

    	         }else{
    	         res.statusCode=406;
    	         res.send({error : "vous n'êtes plus connecté"})
    	         }

	      }
});


app.options('/user',function(req,res,next){
	setHeader(res);
	next();
});


//----------------/USER/ACTION-------------------//
//Fonction renvoie tous les utilisateurs présents dans la db
app.get('/user/action', function (req, res) {


	setHeader(res);
		if ('undefined' == typeof req.param('token')) {
    				res.statusCode=400;
        			res.send({error : "pas le bon id envoyé  "});

        	}
        	else {

        	         var id = token_table.find_id_from_token(req.param('token'));
        	         if (id != -1){
	                    data.getuser(req.param, dataCallback(res));
        	         }else{
        	         res.statusCode=406;
        	         res.send({error : "vous n'êtes plus connecté"})
        	         }

    	      }

});

app.post('/user/action',function(req,res){
    setHeader(res);
    	if (('undefined' == typeof req.body.email && 'undefined' == typeof req.body.login) || 'undefined' == typeof req.body.passwordhashed) {
        			res.statusCode=400;
        			res.send({error : "pas les bons paramètres envoyés "});
		}
        	else {

                    data.connect(req.body, dataExecute(res));
    	        //console.log(res);
        	}

});


app.delete('/user/action',function(req,res){
    setHeader(res);
    	if ('undefined' == typeof req.body.token) {
        			res.statusCode=400;
        			res.send({error : "pas les bons paramètres envoyés "});
		}
        	else {
            token_table.delete_token(req.body.token);    	        //console.log(res);
        	}

});

//---------------APPLET------------------//

//TODO Get applet done

function dataAppletdone(res) {
    console.log("et la ");
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

             res.json(data);

            }

    }
}


app.get('/applet/done', function(req, res) {
	setHeader(res);
	if ('undefined' == typeof req.param('id')){

            res.statusCode=400;
            res.send({error : "pas les bons paramètres envoyés "});
    		}
            else {
                 var id = token_table.find_id_from_token(req.param('token'));
                 if (id != -1){
                    data.appletdonebyid(id, req.param, dataAppletdone(res));

                 }else{
                 res.statusCode=406;
                 res.send({error : "vous n'êtes plus connecté"})
                 }

        	}


});

function dataAllApplet(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {
            res.json(data);
            }

    }
}
app.get('/applet', function(req, res) {
            setHeader(res);
		if ('undefined' == typeof req.param('token')) {
    				res.statusCode=400;
        			res.send({error : "pas le bon id envoyé  "});

        	}
        	else {

        	         var id = token_table.find_id_from_token(req.param('token'));
        	         if (id != -1){
	                    data.getapplet(/*req.body, (gestion du token)*/ dataAllApplet(res));
        	         }else{
        	         res.statusCode=406;
        	         res.send({error : "vous n'êtes plus connecté"})
        	         }

    	      }


});

function datadeleteapp(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

            res.json({message : "Suppression réussi ! "});
            }

    }
}

app.delete('/applet', function(req, res) {
	setHeader(res);
	if (('undefined' == typeof req.body.id)||('undefined' == typeof req.body.token)){

                res.statusCode=400;
                res.send({error : "pas les bons paramètres envoyés "});
        		}
                else {
                    if(req.body.token == 1){
	                     data.deleteapplet(req.body.id, datadeleteapp(res));
                      }
                      else{
                      res.statusCode=402;
                      res.send({error : "vous n'avez pas les permissions"});
                      }
                }

});
function datacreateapp(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

            res.json({id : data.insertId});
            }

    }
}
app.post('/applet', function(req, res) {
	setHeader(res);
		if (('undefined' == typeof req.body.name) || ('undefined' == typeof req.body.domain)||('undefined' == typeof req.body.token) ){

                    res.statusCode=400;
                    res.send({error : "pas les bons paramètres envoyés "});
            		}
                    else {
                         if(req.body.token == 1){
	                         data.createapplet(req.body.name, req.body.domain, req.body, datacreateapp(res));
                          }
                          else{
                          res.statusCode=402;
                          res.send({error : "vous n'avez pas les permissions"});
                          }
                	}

});

function dataupapp(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

            res.json({message : "mise a jour réussi ! "});
            }

    }
}

app.put('/applet', function(req, res) {
	setHeader(res);
	if (('undefined' == typeof req.body.name) || ('undefined' == typeof req.body.token)||('undefined' == typeof req.body.domain)|| ('undefined' == typeof req.body.id) ){

                        res.statusCode=400;
                        res.send({error : "pas les bons paramètres envoyés "});
                		}
                        else {
                         if(req.body.token == 1){
	                        data.updateapplet(req.body.id, req.body.name , req.body.domain ,req.body,  dataupapp(res));
                            }
                            else{
                            res.statusCode=402;
                            res.send({error : "vous n'avez pas les permissions"});
                            }

                    	}
});





function datagetdom(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

                console.log(data);
                res.json(data);

            }

    }
}

app.get('/domain', function(req, res) {
	setHeader(res);
		if ( ('undefined' == typeof req.param('token')) ){

            res.statusCode=400;
            res.send({error : "pas les bons paramètres envoyés "});
            }
            else {

        	         var id = token_table.find_id_from_token(req.param('token'));
        	         if (id != -1){
	                            data.getdomain(datagetdom(res));
        	         }else{
        	         res.statusCode=406;
        	         res.send({error : "vous n'êtes plus connecté"})
        	         }
                        	}
});


function datadeletedom(res) {
    return function(err, data) {
    console.log("test");

		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {
            console.log("test");
            res.json({message : "Suppression réussi ! "});
            }

    }
}


app.delete('/domain', function(req, res) {
	setHeader(res);
	if (('undefined' == typeof req.body.id)||('undefined' == typeof req.body.token)){

                    res.statusCode=400;
                    res.send({error : "pas les bons paramètres envoyés "});
            		}
                    else {
                        if(req.body.token == 1){
                               data.deletedomain(req.body.id, datadeletedom(res));
                            }
                            else{
                            res.statusCode=402;
                            res.send({error : "vous n'avez pas les permissions"});
                            }	                 	}
});


function datacreatedom(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

                console.log(data[0]);
                res.json({id : data.insertId });

            }

    }
}


app.post('/domain', function(req, res) {
	setHeader(res);
	if ( ('undefined' == typeof req.body.id)||('undefined' == typeof req.body.token)||('undefined' == typeof req.body.name) ){

                    res.statusCode=400;
                    res.send({error : "pas les bons paramètres envoyés "});
                    }
                    else {
                            if(req.body.token == 1){
	                            data.createdomain(req.body.name, req.body, datacreatedom(res));
                            }
                            else{
                            res.statusCode=402;
                            res.send({error : "vous n'avez pas les permissions"});
                            }
                            	}
});
function dataupdom(res) {
    return function(err, data) {
		if (err) {
			res.statusCode=500;
			res.send({error : err});

        } else {

            res.json({message : "mise a jour réussi ! "});
            }

    }
}
app.put('/domain', function(req, res) {
    setHeader(res);
    if (('undefined' == typeof req.body.name) ||('undefined' == typeof req.body.token) ||  ('undefined' == typeof req.body.id) ){

        res.statusCode=400;
        res.send({error : "pas les bons paramètres envoyés "});
        }
        else {
            if(req.body.token == 1){
                  data.updatedomain(req.body.id, req.body.name, req.body,  dataupdom(res));
                  }
                  else{
                  res.statusCode=402;
                  res.send({error : "vous n'avez pas les permissions"});
                  }

        }
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




app.options('/applet/done',function(req,res,next){
	setHeader(res);
	next();
});