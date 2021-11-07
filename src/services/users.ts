import { UserCreationAttributes } from 'model/user.model';
import { User } from '../model';

export const findUsers = () => User.findAll();
export const createUser = (userData: UserCreationAttributes) => User.create(userData);
export const checkPassword = async (userId: string, password: string) => {
  const user = await User.findByPk(userId);
  return !!user?.isCorrectPassword(password);
};