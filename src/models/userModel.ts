import users from '../data/users.json';
import { IUser, IUserToCreate, IUserToUpdate } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function findAllUsers() {
  return users;
}

export async function findUserById(id: string) {
  const user = users.find((el) => el.id === id);
  return user;
}

export async function createUserModel(user: IUserToCreate) {
  const newUser: IUser = {
    id: uuidv4(),
    ...user,
  };
  users.push(newUser);
  return newUser;
}

export async function updateUserModel(id: string, newUserData: IUserToUpdate) {
  const userIndex = users.findIndex((el) => el.id === id);
  if (userIndex === -1) {
    return null;
  }
  const updateUser = { ...users[userIndex], ...newUserData };
  users[userIndex] = updateUser;
  return updateUser;
}
