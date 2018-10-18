var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
            console.log("User is not verified bcz error in payload");
              return done(err, false);
          }
          if (user) {
              console.log("User is verified at passport");
              return done(null,user);
          } else {
            console.log("User is not found at passport");
              return done(null, false);
          }
      });
  }));
};
