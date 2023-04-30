import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { userModel } from '../db/models/users.model.js';
import { compareData, hashData } from '../utils.js';
import UsersManager from '../Dao/UsersManagerMongo.js';

const usersManager = new UsersManager();

//Local Strategy
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      const user = await usersManager.loginUser(email);
      if (!user || !user.password) {
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

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userDB = await userModel.findOne({ email });
      if (userDB) {
        return done(null, false);
      }
      const hashPassword = await hashData(password);
      const newUser = { ...req.body, password: hashPassword };
      const newUserDB = await userModel.create(newUser);
      done(null, newUserDB);
    }
  )
);

//Github Strategy
passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: 'Iv1.ef7ef58937b33c2b',
      clientSecret: '109909b263393820ed65c07ea5d19def613efc47',
      callbackURL: 'http://localhost:8080/register/github',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const userDB = await userModel.findOne({ email });
        if (userDB) {
          return done(null, userDB);
        }
        const newUser = {
          firstName: profile._json.name.split(' ')[0],
          lastName: profile._json.name.split(' ')[1] || '',
          email,
        };
        const newUserDB = await userModel.create(newUser);
        done(null, newUserDB);
      } catch (e) {
        console.error(e);
        done(null, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
