import { Strategy, ExtractJwt } from 'passport-jwt';
import User from './models/User';

export const passportStrategy = (passport: any) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
  };
  passport.use(
    new Strategy(options, (jwtPayload, done) => {
      User.findOne({ email: jwtPayload.email }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
