import { Router } from 'express';
import UsersManager from '../Dao/UsersManagerMongo.js';

const router = Router();
const usersManager = new UsersManager();

router.get('/', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  const newUser = await usersManager.createUser(req.body);
  if (newUser) {
    res.redirect('/register/login');
  } else {
    res.redirect('/register/errorRegister');
  }
});

router.get('/errorRegister', (req, res) => {
  res.render('errorRegister');
});

router.get('/errorLogin', (req, res) => {
  res.render('errorLogin');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersManager.loginUser(req.body);
  if (user) {
    req.session['email'] = email;
    req.session['firstName'] = user.firstName;
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      req.session['role'] = 'admin';
    } else {
      req.session['role'] = 'user';
    }
    res.redirect(`/views/realtimeproducts`);
  } else {
    res.redirect('/register/errorLogin');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/register/login');
  });
});

export default router;
