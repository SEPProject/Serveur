var mysql       =     require("mysql");

/*
* Configure MySQL parameters.
*/
var connection  =     mysql.createConnection({
host : "mysql.sepdb.alwaysdata.net",
user : "sepdb",
password : "security1",
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
    var q = 'INSERT INTO ' + table + '(id,';

    var clause = hashToClause(values, ', ');

     console.log("affichage de values");
        console.log(values);
 console.log("affichage de clause");
    console.log(clause);
    q += clause.clause + ') VALUES (""'+',\'' + values.email +'\',\''+values.login+'\',\''+values.passwordhashed+'\')';
    // On envoie la reqûete avec le callback fourni.
    // Les paramètres dans clause.values sont automatiquement échappés.
    console.log("affichage de q");
    console.log(q);
    connection.query(q, clause.values, callback);
}


function remove(table, where, callback) {
    var q = 'DELETE FROM ' + table + ' WHERE ';
    var clause = hashToClause(where, ' AND ');
    q += clause.clause;
    console.log(q);
    connection.query(q, clause.values, callback);
}

function read(table, where, columns, callback) {
    var columnsClause = (columns ? columns.join(', ') : '*');
    var q = 'SELECT ' + columnsClause + ' FROM ' + table;
    if (where) {

        var clause = hashToClause(where, ' AND ');
        q += ' WHERE ' + clause.clause +'='+ where.id;
    }
    connection.query(q, (where ? clause.values : callback), callback);
}


function update(table, where, values, callback) {
 var whereClause = hashToClause(where, ' AND ');
var valuesClause = hashToClause(values, ' AND ');
    var q = 'UPDATE ' + table + ' SET ' +'`email`'+'=\''+ values.email+ '\' ,`login`'+'=\''+ values.login +'\' ,`passwordhashed`'+'=\''+ values.passwordhashed + '\' WHERE ' +
        '`id`'+'=\''+ values.id + '\';';
        console.log(q);
    connection.query(q, whereClause.values.concat(valuesClause.values), callback);
}

exports.insert = insert;
exports.remove = remove;
exports.read = read;
exports.update = update;
exports.hashToClause;

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
 
exports.findAll = function(table, callback) {
    read(table, null, null, callback);
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



