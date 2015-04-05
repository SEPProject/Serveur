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

exports.getapplet = function(callback) {
    db.findAll('`sepdb_database`.`applet_table`', callback);
}

exports.deleteapplet = function(id, callback) {

    db.removeapplet('`sepdb_database`.`applet_table`',id, callback);
}

exports.createapplet = function(name,domain, values, callback) {
    if (checkColumns(values)) {
        console.log(values);

        db.insertapplet('`sepdb_database`.`applet_table`', name,domain, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.updateapplet = function(id,name, domain,values, callback) {
    if (checkColumns(values)) {
        db.updateapp('`sepdb_database`.`applet_table`', id, name,domain, callback);
    } else {
        callback('Invalid column name', null);
    }
}


exports.getdomain = function(callback) {
    db.findAll('`sepdb_database`.`domain_table`', callback);
}

exports.deletedomain = function(id, callback) {
    db.removedomain('`sepdb_database`.`domain_table`',id, callback);
}

exports.createdomain = function(name, values, callback) {
    if (checkColumns(values)) {
        db.insertdomain('`sepdb_database`.`domain_table`', name, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.updatedomain = function(id, name,  values, callback) {
    if (checkColumns(values)) {
        db.updatedom('`sepdb_database`.`domain_table`', id, name, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.connect = function(values, callback){
    //console.log(values);
    if (checkColumns(values)) {
       // console.log(values.login);
        db.connexion(values.login, values.passwordhashed, callback);
    }else {
        callback('Invalid column name', null);
    }
}
exports.appletdonebyid = function(id, values, callback){
    //console.log(values);
    if (checkColumns(values)) {
       // console.log(values.login);
        db.appdone(id, callback);
        console.log("test son");
    }else {
        callback('Invalid column name', null);
    }
}