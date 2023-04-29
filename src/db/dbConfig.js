import mongoose from 'mongoose';

const URI = 'mongodb+srv://pmilitello:12345@cluster0.op8ms3d.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose
  .connect(URI)
  .then(() => console.log('Database connected'))

  .catch((error) => console.log(error));
