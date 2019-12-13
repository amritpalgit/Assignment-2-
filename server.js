
//including modules for save data
var S = require('./module/signup');
var express =require('express')
//using port
var PORT=3000
var server=express()
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
server.use(session({secret:'XASDASDA'}));
var ssn
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.resolve(__dirname, 'public')));
//check login 
server.post('/chk',function(req,res){
    ssn=req.session;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
var uname=req.body.username;
var pass=req.body.pwd;
dbo.collection("users-data").findOne({name: uname}).then(function(name){  
            if(name){
                    if (pass==name.password){
                        ssn.uname
                        
                res.redirect('/add-post');
                    }	else{
                        
                console.log("password not match")
                
                res.redirect('/login');
                    }
                
            }else{
                res.redirect('/login',{err:"username not match"});
                console.log("username not match")
            }
        })

      });
})
//save user data
server.post('/adduser', function (req, res) {
      
    S.userSave(req.body['username'], req.body['pwd'],req.body['email'],req.body['address'], function(e, o){
        if (!o){
            res.status(400).send(e);
          
        }	else{
                     
        }
     });
     res.redirect("/login")
});
//save post
server.post('/save-post', function (req, res) {
      
    S.postSave(req.body['title'], req.body['des'],req.body['price'], function(e, o){
        if (!o){
            res.status(400).send(e);
          
        }	else{
                     
        }
     });
     res.redirect("/posts")
});
//all posts are shown
server.get('/posts',function(req,res){

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("post-data").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          res.render('post',{items:result})
        });
      });
})
//editing of post
server.get('/edit-post',function(req,res){
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var id=req.query.id;
        console.log(id)
        dbo.collection("post-data").find({}, { projection: { _id: id,title:1,price:1} }).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            db.close();
            res.render('edit-post',{items:result})
          });
      });

})
//deleting post
server.get('/delete-post',function(req,res){
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var id=req.query.id;
        var myquery = { _id:id};
        dbo.collection("post-data").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
                console.log('delete')
          db.close();
         
        });
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("post-data").find({}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
              db.close();
              res.render('post',{items:result})
            });
          });

})
})

server.set('view engine','pug')
server.locals.basedir = path.join(__dirname, 'views');
server.use(express.static(path.join(__dirname, 'public')));
server.use('/css', express.static('css'))
server.get('/',function(req,res){
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("post-data").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          res.render('home',{items:result})
        });
      });
})
//login page
server.get('/login',function(req,res){
    res.render ('login')
})
//signup page
server.get('/reg',function(req,res){
    res.render('signup')
})
server.get('/add-post',function(req,res){
    res.render('add-post')
})
//update post
server.get('/update-post',function(req,res){
    res.render('post')
})

server.listen(PORT,function(){
    console.log('Server working on PORT:'+PORT)
})
