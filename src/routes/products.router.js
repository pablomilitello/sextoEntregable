import { Router } from 'express';
import ProductManager from '../Dao/ProductManagerMongo.js';
import { __dirname, validateInteger, validateSort, validateBoolean } from '../utils.js';

const path = __dirname + '/products.json';

const router = Router();

const productManager = new ProductManager(path);

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, category, availability } = req.query;

    if (!validateInteger(limit, 1, 200)) {
      res.status(400).json('wrong limit');
      return;
    }
    if (!validateInteger(page, 1, 10000)) {
      res.status(400).json('wrong page');
      return;
    }

    if (availability && !validateBoolean(availability)) {
      res.status(400).json('wrong availability');
      return;
    }

    let { sort } = req.query;
    sort = sort?.toLowerCase();
    if (sort && !validateSort(sort)) {
      res.status(400).json('wrong sort');
      return;
    }

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      await productManager.getProducts(parseInt(limit), parseInt(page), sort, category, availability);

    let prevLink = null;
    if (hasPrevPage) {
      prevLink = `/api/products?limit=${limit}&page=${prevPage}&`;
      if (availability) {
        prevLink += `availability=${availability}&`;
      }
      if (category) {
        prevLink += `category=${category}&`;
      }
      if (sort) {
        prevLink += `sort=${sort}`;
      }
    }

    let nextLink = null;
    if (hasNextPage) {
      nextLink = `/api/products?limit=${limit}&page=${nextPage}&`;
      if (availability) {
        prevLink += `availability=${availability}&`;
      }
      if (category) {
        nextLink += `category=${category}&`;
      }
      if (sort) {
        nextLink += `sort=${sort}`;
      }
    }

    const response = {
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'product search error' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      res.json({ message: 'Product does not exist' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'Product search error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const obj = req.body;
    const newProduct = await productManager.addProducts(obj);
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    console.error(err);
    res.status(400).json({ error: 'It was not possible to add the product' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const obj = req.body;
    const product = await productManager.updateProduct(pid, obj);
    res.status(201).json({ product });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'Error updating the product' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const response = await productManager.deleteProducts();
    res.status(201).json({ response });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'It was not possible to delete the products' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await productManager.deleteProductsById(pid);
    res.status(201).json({ products });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'It was not possible to delete the product' });
  }
});

export default router;
