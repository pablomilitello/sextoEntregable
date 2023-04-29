import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import './db/dbConfig.js';
import ProductManager from '../src/Dao/ProductManagerMongo.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import registerRouter from './routes/register.router.js';
import mongoStore from 'connect-mongo';

const path = __dirname + '/products.json';
const productManager = new ProductManager(path);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Configuración Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Cookies
app.use(cookieParser('secretPass'));

//Mongo Sessions
const URI = 'mongodb+srv://pmilitello:12345@cluster0.op8ms3d.mongodb.net/ecommerce?retryWrites=true&w=majority';
app.use(
  session({
    store: new mongoStore({
      mongoUrl: URI,
    }),
    secret: 'secretSession',
    cookie: {
      maxAge: 120000,
    },
  })
);

//Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);
app.use('/register', registerRouter);

app.get('/createCookie', (req, res) => {
  res.cookie('cookie2', 'Second Cookie').send('Cookie added');
});

app.get('/readCookie', (req, res) => {
  const { cookie1, cookie2 } = req.cookies;
  res.json({ message: 'Cookies', cookie1, cookie2 });
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('cookie1').send('Cookie deleted');
});

app.get('/createCookieSigned', (req, res) => {
  res.cookie('cookieSigned1', 'First Cookie Signed', { signed: true }).send('Cookie signed');
});

app.get('/readCookieSigned', (req, res) => {
  const { cookieSigned1 } = req.signedCookies;
  res.json({ message: 'Cookies Signed', cookieSigned1 });
});

const PORT = 8080;

//Configuro el SocketServer
const httpServer = app.listen(PORT, () => console.log(`Listen in port ${PORT}`));

const messages = [];

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log(`Client conected id: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconected id: ${socket.id}`);
  });

  socket.on('addNewProduct', async (product) => {
    await productManager.addProducts(product);
  });

  socket.on('deleteProduct', (id) => {
    console.log(`Product deleted ${id}`);
    productManager.deleteProductsById(id);
  });

  socket.on('message', (info) => {
    messages.push(info);
    socketServer.emit('chat', messages);
  });

  socket.on('newUser', (newUser) => {
    socket.broadcast.emit('broadcastChat', newUser);
    socketServer.emit('chat', messages);
  });
});
