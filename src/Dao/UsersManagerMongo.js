import { userModel } from '../db/models/users.model.js';

class UsersManager {
  async createUser(user) {
    const { email, password } = user;
    try {
      const existUser = await userModel.find({ email, password });
      if (existUser.length === 0) {
        const newUser = await userModel.create(user);
        return newUser;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async loginUser(user) {
    const { email, password } = user;
    try {
      const user = await userModel.findOne({ email, password });
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default UsersManager;
