const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const fs = require('fs');

const User = require('../models/User');

const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};

const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = fs.readFileSync('keys/ec-public.pem');
opts.issuer = 'jwt.example.com';
opts.audience = 'localhost';
opts.algorithm = 'ES512';
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    return done(null, jwt_payload.sub.access);
}));
