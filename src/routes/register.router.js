import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/errorRegister', (req, res) => {
  res.render('errorRegister');
});

router.get('/errorLogin', (req, res) => {
  res.render('errorLogin');
});

//Passport
router.post('/', passport.authenticate('register', { failureRedirect: '/register/errorRegister' }), (req, res) => {
  res.redirect('/register/login');
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/register/errorLogin' }), (req, res) => {
  res.redirect(`/views/realtimeproducts`);
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/register/login');
  });
});

router.get(
  '/signupGithub',
  passport.authenticate('github', { scope: ['user:email'], failureRedirect: '/register/errorRegister' })
);

router.get('/github', passport.authenticate('github', { failureRedirect: '/register/errorLogin' }), (req, res) => {
  res.redirect('/views/realtimeproducts');
});

export default router;
