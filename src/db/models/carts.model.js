import mongoose from "mongoose";

var subSchema = mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
    quantity: Number,
  },
  { _id: false }
);

const cartsSchema = new mongoose.Schema({
  products: [subSchema],
});

export const cartModel = mongoose.model('Carts', cartsSchema);
