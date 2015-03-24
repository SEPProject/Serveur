var db = require('./bdd.js');


var columnNameRegex = /^([a-zA-Z0-9_$]{1,64}\.)?[a-zA-Z0-9_$]{1,64}$/;
function checkColumnName(name) {
    return columnNameRegex.test(name);
}
 
function checkColumns(obj) {
    for (var key in obj) {
        if (!checkColumnName(key)) {
            return false;
        }
    }
    return true;
}

exports.getuser = function(id, callback) {
    console.log(id.id);
    db.find('`sepdb_database`.`user_table`', id.id, callback);
}

exports.adduser = function(values, callback) {
    if (checkColumns(values)) {
        db.insert('`sepdb_database`.`user_table`', values, callback);


    } else {
        callback('Invalid column name', null);
    }
}

exports.updateuser = function(id, values, callback) {
    if (checkColumns(values)) {
        console.log(values);
        db.updateById('`sepdb_database`.`user_table`', id, values, callback);
    } else {
        callback('Invalid column name', null);
    }
}
exports.removeuser = function(id, callback) {

    db.removeById('`sepdb_database`.`user_table`',id,callback);
}

exports.getappletdone = function(id, callback) {
    db.find('applet_table', id, callback);
}

exports.getapplet = function(id, callback) {
    db.find('`sepdb_database`.`applet_table`',id.id, callback);
}

exports.deleteapplet = function(id, callback) {
    db.removeById('applet_table',id, callback);
}

exports.createapplet = function(values, callback) {
    if (checkColumns(values)) {
        db.insert('`sepdb_database`.`applet_table`', values, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.updateapplet = function(id, values, callback) {
    if (checkColumns(values)) {
        db.updateById('applet_table', id, values, callback);
    } else {
        callback('Invalid column name', null);
    }
}


exports.getdomain = function(callback) {
    db.findall('domain_table', callback);
}

exports.deletedomain = function(id, callback) {
    db.removeById('domain_table',id, callback);
}

exports.createdomain = function(values, callback) {
    if (checkColumns(values)) {
        db.insert('domain_table', values, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.updatedomain = function(id, values, callback) {
    if (checkColumns(values)) {
        db.updateById('domain_table', id, values, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.connect = function(values, callback){
    console.log(values);
    if (checkColumns(values)) {
        console.log(values.login);
        db.connexion(values.login, values.passwordhashed, callback);
    }else {
        callback('Invalid column name', null);
    }
}
