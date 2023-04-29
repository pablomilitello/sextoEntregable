import { Router } from 'express';
import CartManager from '../Dao/CartManagerMongo.js';
import { __dirname } from '../utils.js';

const path = __dirname + '/carts.json';

const router = Router();

const cartManager = new CartManager(path);

const products = [1, 2, 3];

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCarts();
    res.status(201).json({ message: 'Cart created', cart: newCart });
  } catch (error) {
    console.log(error);
    res.status(500).json('cart search error');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartByIdPopulated(cid);
    if (!cart) {
      res.json({ message: 'Cart does not exist' });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('cart search error');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newCart = await cartManager.addProductsToCart(cid, pid);
    if (newCart === "Error: Cart doesn't exist") {
      res.status(404).json({ message: "Cart doesn't exist" });
    } else if (newCart === "Error: Product doesn't exist") {
      res.status(404).json({ message: "Product doesn't exist" });
    } else {
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() || 'It was not possible to add the product' });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(400).json({ message: "Cart does not exist" });
    }
    const newCart = await cartManager.deleteProductFromCart(cid, pid);
    res.status(200).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json("cart search error");
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(400).json({ message: "Cart does not exist" });
    }
    const products = req.body;
    if (!Array.isArray(products)) {
      res.status(400).json({ message: "Products must be an array" });
    }
    const newCart = await cartManager.updateCart(cid, products);
    res.status(200).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json("cart update error");
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(400).json({ message: "Cart does not exist" });
    }

    if (typeof req.body != "object") {
      res.status(400).json({ message: "wrong body" });
    }
    const { quantity } = req.body;
    if (!Number.isInteger(quantity)) {
      res.status(400).json({ message: "wrong quantity" });
    }

    const newCart = await cartManager.updateCartProduct(cid, pid, quantity);
    res.status(200).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json("cart product update error");
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(400).json({ message: "Cart does not exist" });
    }

    const newCart = await cartManager.deleteAllProductsFromCart(cid);
    res.status(200).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json("cart products delete error");
  }
});

export default router;
