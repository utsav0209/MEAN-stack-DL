var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");
var ExtractJwt = require('passport-jwt').ExtractJwt;


router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
  
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {

          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token){
    uploader = getName(token);

    var newBook = new Book({
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      uploader : this.uploader
    });
    console.log("New Book : "+newBook);
    newBook.save(function(err) {
      if (err) {
        console.log("error at saving book"+err);
        return res.json({success: false, msg: 'Save book failed.'});
      }
      console.log("Book saved");
      res.json({success: true, msg: 'Successfully created new book.'});
    })
  }else{
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {

  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err){console.log(err+"at get book"); return next(err);}
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/booksofuser', passport.authenticate('jwt', { session: false}), function(req, res) {

  var token = getToken(req.headers);
  if (token) {
    Book.find({uploader :  getName(token) },function (err, books) {
      if (err){console.log(err+"at get booksofuser"); return next(err);}
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/findonebook', passport.authenticate('jwt', { session: false}), function(req, res) {

  var token = getToken(req.headers);
  if (token) {
    Book.findById(req.body.id,function (err, books) {
      if (err){console.log(err+"at get booksofuser"); return next(err);}
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/updatebook', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token){
    Book.findByIdAndUpdate(req.body._id,{
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
    },function(err,books){
        if (err) {
        console.log("error at updating book"+err);
        return res.json({success: false, msg: 'Update book failed.'});
      }
      console.log("Book updated");
      res.json({success: true, msg: 'Successfully updated book.'});
    })
  }else{
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/deletebook', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token){
    Book.findByIdAndRemove(req.body.id,function(err,books){
        if (err) {
        console.log("error at deleting book"+err);
        return res.json({success: false, msg: 'Save book failed.'});
      }
      console.log("Book deleted");
      res.json({success: true, msg: 'Successfully deleted book.'});
    })
  }else{
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/upload', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    res.json(null);
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getName = function (token) {

  var  decoded;
  try {
      decoded = jwt.verify(token,config.secret);
      decoded = JSON.stringify(decoded.username);
      var parted = decoded.split('"');
      console.log(parted[1]);
      return(parted[1]);
  } catch (e) {
      console.log("Error in finding user");
      return res.status(401).send('unauthorized');
  }
};
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;