import users from '../data/users.json';
import { IUser, IUserToCreate } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

export function findAllUsers() {
  return new Promise((resolve) => {
    resolve(users);
  });
}

export function findUserById(id: string) {
  return new Promise((resolve) => {
    const user = users.find((el) => el.id === id);
    resolve(user);
  });
}

export function createUserModel(user: IUserToCreate) {
  return new Promise((resolve) => {
    const newUser: IUser = {
      id: uuidv4(),
      ...user,
    };
    users.push(newUser);
    resolve(newUser);
  });
}
