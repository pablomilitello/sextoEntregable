import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
//import { Strategy as GithubStrategy } from 'passport-github';
import { userModel } from '../db/models/users.model.js';
import { compareData } from '../utils.js';

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      const user = await usersManager.loginUser(email);
      if (!user) {
        return done(null, false);
      }
      const isPassword = await compareData(password, user.password);
      if (!isPassword) {
        return done(null, false);
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(err, user);
});
