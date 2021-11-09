import { UserCreationAttributes } from 'model/user.model';
import { User } from '../model';

export const findUsers = () => User.findAll();

export const createUser = (userData: UserCreationAttributes) => User.create(userData);

export const getUserById = async (userId: number) => User.findByPk(userId);

export const getUserByName = async (username: string) => User.findOne({ where: { username } });
