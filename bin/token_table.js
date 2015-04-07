/**
 * Created by julescantegril on 30/03/2015.
 */
var existing_token = [];

 exports.add_token = function(data){
    var newToken = 0;
    var exist = false;

     this.delete_old_token();
    while(newToken == 0 || exist == true){
        for(var i in existing_token){
            if(existing_token[i].token == newToken){
                exist = true;
            }
        }
       newToken = Math.floor((Math.random() * 1000000) + 1);
    }
    var d = new Date();
    existing_token.push({"id":data.id,"token":newToken,"time": d.getTime()});
    console.log(JSON.stringify(existing_token)+"les ");
     return newToken;
};



exports.delete_old_token = function (){
    var newExistingToken = [];
    var d = new Date();
    var timeMaxConnexion = 300000;//en milliseconde
    for(var i in existing_token){
        if(!(existing_token[i].time- d.getTime > timeMaxConnexion)){
            newExistingToken.push(existing_token[i]);
        }
    }
    existing_token = newExistingToken;
    console.log(existing_token+"les tens");
};
exports.delete_token = function(token){
    this.delete_old_token();
    var newExistingToken = [];
    for(var i in existing_token){
        if(!(token == existing_token[i].token)){

            newExistingToken.push(existing_token[i]);
        }
    }
    existing_token = newExistingToken;
    console.log(existing_token+"les tokes");
};

exports.find_token_from_id = function(id){
    this.delete_old_token();
    for(var i in existing_token){
        if((id == existing_token[i].id)){
            return existing_token[i].token;
        }
    }
    return -1;
};

exports.update_token = function(token){
    this.delete_old_token();
    var d = new Date();
    for(var i in existing_token){
        if((token == existing_token[i].token)){
            existing_token[i].time = d.getTime();
        }
    }
};


exports.find_id_from_token = function(token){
    this.delete_old_token();
    for(var i in existing_token){
        if((token == existing_token[i].token)){

            return existing_token[i].id;
        }

    }
    return -1;
};