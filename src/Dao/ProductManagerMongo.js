import { productModel } from '../db/models/products.model.js';
import { TRUE, FALSE } from '../utils.js';

class ProductManager {
  getProducts = async (limit, page, sortDir, category, availability, lean = false) => {
    const options = { page, limit, lean };
    if (sortDir) {
      options.sort = { price: sortDir };
    }
    const query = {};
    if (category) {
      query.category = { $regex: new RegExp(`${category}`, 'i') };
    }

    if (availability === TRUE) {
      query.stock = { $gt: 0 };
    } else if (availability === FALSE) {
      query.stock = 0;
    }

    const products = await productModel.paginate(query, options);
    return products;
  };

  getProductById = async (id) => {
    try {
      const product = await productModel.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  addProducts = async (product) => {
    try {
      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  };

  aggregationFun = async () => {
    try {
      const response = await productModel.aggregate();

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (id, obj) => {
    try {
      const product = await productModel.findOneAndUpdate({ _id: id }, obj);
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProducts = async () => {
    try {
      await productModel.deleteMany();
      return 'Products deleted';
    } catch (error) {
      console.log(error);
    }
  };

  deleteProductsById = async (id) => {
    try {
      await productModel.deleteOne({ _id: id });
      return 'Product deleted';
    } catch (error) {
      console.log(error);
    }
  };
}

export default ProductManager;
