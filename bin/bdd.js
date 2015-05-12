var mysql       =     require("mysql");

/*
* Configure MySQL parameters.
*/
/*var connection  =     mysql.createConnection({
host : "mysql.sepdb.alwaysdata.net",
user : "sepdb",
password : "security1",
database : "sepdb_database"
});*/
var connection  =     mysql.createConnection({
host : "127.0.0.1",
port : "3306",
user : "root",
password: 'sep',
database : "sepdb_database"
});


function hashToClause(hash, separator) {
    var result = '';

    var values = [];
    var first = true;
    for (var key in hash) {
        result += (first ? '' : separator) + key ;

        values.push(hash[key]);

        first = false;
    }
    return { clause : result, values : values };
}


function insert(table, values, callback) {

    // On construit la requête dynamiquement
    var q = 'INSERT INTO ' + table + '(';

    var clause = hashToClause(values, ', ');
    console.log("valeur de clause");
    console.log(clause.clause);
    if(clause.clause == "email, login, passwordhashed"){


    q += clause.clause + ') VALUES (\'' + values.email +'\',\''+values.login+'\',\''+values.passwordhashed+'\')';
    // On envoie la reqûete avec le callback fourni.
    // Les paramètres dans clause.values sont automatiquement échappés.
    console.log(q);
    var query = connection.query(q, clause.values, callback);


    }else{
    connection.query(q, clause.values, callback);

    }

}


function remove(table, where, callback) {
    var q = 'DELETE FROM ' + table + ' WHERE ';
    var clause = hashToClause(where, ' AND ');
    console.log(clause);
    if(clause.clause == "id"){
        q += '`' + clause.clause + '` = ' + where.id;
        console.log(q);
        connection.query(q, clause.values, callback);

    }
    else{
        q = NULL;
        connection.query(q, clause.values, callback);

    }
}

function read(table, where, columns, callback) {
    var columnsClause = (columns ? columns.join(', ') : '*');
    var q = 'SELECT ' + columnsClause + ' FROM ' + table;
    if (where) {

        var clause = hashToClause(where, ' AND ');
        q += ' WHERE ' + clause.clause +'='+ where.id;

    }
    console.log(q);
    connection.query(q, (where ? clause.values : callback), callback);
}


function update(table, where, values, callback) {
 var whereClause = hashToClause(where, ' AND ');
var valuesClause = hashToClause(values, ' AND ');
    var q = 'UPDATE ' + table + ' SET ' +'`email`'+'=\''+ values.email+ '\' ,`login`'+'=\''+ values.login +'\' ' + ' WHERE ' +
        '`id`'+'=\''+ where.id + '\';';
        console.log(q);
    connection.query(q, whereClause.values.concat(valuesClause.values), callback);

}
function insertapplet(table, name,domain, callback) {

    // On construit la requête dynamiquement
    var q = 'INSERT INTO ' + table + '(';

    q += 'name , domain' + ') VALUES (\'' + name +' \',(SELECT id FROM `sepdb_database`.`domain_table` WHERE name =\''+domain+'\'))';
    // On envoie la reqûete avec le callback fourni.
    // Les paramètres dans clause.values sont automatiquement échappés.
    console.log(q);
    var query = connection.query(q, callback);

}
exports.insertdomain =  function (table, name, callback) {

    // On construit la requête dynamiquement
    var q = 'INSERT INTO ' + table + '(';

    q += 'name' + ') VALUES (\'' + name +' \')';
    // On envoie la reqûete avec le callback fourni.
    // Les paramètres dans clause.values sont automatiquement échappés.
    console.log(q);
    var query = connection.query(q, callback);

}

exports.insert = insert;
exports.remove = remove;
exports.read = read;
exports.update = update;
exports.hashToClause;
exports.insertapplet = insertapplet;

// On peut simplifier les opérations courantes (liste, modification via
// l'id, etc.) avec les fonctions suivantes.
exports.updateById = function(table, id, values, callback) {

    update(table, { 'id' : id }, values, callback);
}
 
exports.find = function(table, id, callback) {
    read(table, { 'id' : id }, null, callback);
}
 
exports.removeById = function(table, id, callback) {

    remove(table, { 'id' : id }, callback);

}

exports.removeapplet = function(table, id, callback) {
    /*var qtest = 'SELECT * FROM ' + table + 'WHERE id=' + id;
    var querytest =  connection.query(qtest, function(err, rows) {
      if (!err){
      if (rows == []){
            console.log("essai");*/
            var q = 'DELETE FROM ' + table + ' WHERE ';
            q +='`' + 'id' + '` = ' + id;
            console.log(q);
            var query = connection.query(q, callback);

     /* else
            res.json({message : "pas supprimé l'id de cet applet n'existe pas ! "});
      }
*/
    }


exports.updateapp = function (table, id, name,domain, callback) {
                        var q = 'UPDATE ' + table + ' SET ' +'`name`'+'=\''+ name+ '\' ,`domain`'+'='+ '(SELECT id FROM `sepdb_database`.`domain_table` WHERE name =\''+domain+'\')' + ' WHERE ' +
                            '`id`'+'=\''+ id + '\';';
                            console.log(q);
                        connection.query(q, callback);

                    }

exports.findAll = function(table, callback) {
    read(table, null, null, callback);
}

exports.connexion = function(login,passwordhashed, callback){
    connection.query('SELECT id FROM `sepdb_database`.`user_table` WHERE (login="'+login+'" AND passwordhashed="'+passwordhashed+'") OR (email="'+login+'"AND passwordhashed="'+passwordhashed+'")',callback);
         /*   execute(function(error, rows, cols) {
                    if (error) {
                        console.log('ERROR: ' + error);
                        return;
                    }
                    if(rows.length == 1){ // Le compte existe
                            console.log("alors la tu te connectes");
                        }
                        });*/
}
/*Connecting to Database*/

connection.connect(function(error){
if(error)
{
console.log("Problem with MySQL"+error);
}
else
{
console.log("Connected with Database");
}
});


exports.removedomain = function(table, id, callback) {
            console.log("essais ");
            var q = 'DELETE FROM ' + table + ' WHERE ';
            q +='`' + 'id' + '` = ' + id;
            console.log(q);
            var query = connection.query(q, callback);


    }
exports.updatedom = function (table, id, name, callback) {
                        var q = 'UPDATE ' + table + ' SET ' +'`name`'+'=\''+ name+ '\'' + ' WHERE ' +
                            '`id`'+'=\''+ id + '\';';
                            console.log(q);
                        connection.query(q, callback);

                    }

exports.appdone = function (id, callback) {
                        var q = 'SELECT name FROM `sepdb_database`.`applet_table` WHERE id IN (SELECT appletID FROM `sepdb_database`.`applet_done_by_user_table` WHERE userID = ' + id+ ');';
                        console.log(q);
                        connection.query(q, callback);

                    }
exports.updatewithpwd = function(table, id, login, email, pwd, pwdold, callback){
                     var q = 'UPDATE `sepdb_database`.`user_table`' + ' SET ' +'`email`'+'=\''+ email+ '\' ,`login`'+'=\''+ login +'\' ,`passwordhashed`'+'=\''+ pwd + '\' WHERE ' +
                                                                                                                    '(`id`'+'= \''+ id + '\' AND `passwordhashed`=\''+ pwdold + '\')'+';';
                     console.log(q);
                     connection.query(q, callback);


                    }

exports.userinfo = function (id, callback) {
                        var q = 'SELECT email, login, passwordhashed FROM `sepdb_database`.`user_table` WHERE id = ' + id+ ';';
                            console.log(q);
                        connection.query(q, callback);

                    }
