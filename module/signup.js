
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//save user data 
exports.userSave = function(username, pass,email,address, callback)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");

dbo.collection("users-data").findOne({name:username}).then(function(user){
            if(user){
                console.log("user already exsit")
            }else{

                var myobj = { name:username, password:pass,email:email,address:address};
                dbo.collection("users-data").insertOne(myobj, function(err, res) {
                 if (err) throw err;
                console.log("User Saved")
                 db.close();
               });
            }
        })

      });
}
exports.postSave = function(title, des,price, callback)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
                var myobj = { title:title, des:des,price:price};
                dbo.collection("post-data").insertOne(myobj, function(err, res) {
                 if (err) throw err;
                console.log("Post Saved")
                 db.close();
        })

      });
}
