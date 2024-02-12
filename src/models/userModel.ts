import { users_DB } from '../data/users';
import { IUser, IUserToCreate, IUserToUpdate } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function findAllUsers() {
  return users_DB;
}

export async function findUserById(id: string) {
  const user = users_DB.find((el) => el.id === id);
  return user;
}

export async function createUserModel(user: IUserToCreate) {
  const newUser: IUser = {
    id: uuidv4(),
    ...user,
  };
  users_DB.push(newUser);
  return newUser;
}

export async function updateUserModel(id: string, newUserData: IUserToUpdate) {
  const userIndex = users_DB.findIndex((el) => el.id === id);
  if (userIndex === -1) {
    return null;
  }
  const updateUser = { ...users_DB[userIndex], ...newUserData };
  users_DB[userIndex] = updateUser;
  return updateUser;
}

export async function deleteUserModel(id: string) {
  const userIndex = users_DB.findIndex((el) => el.id === id);
  if (userIndex === -1) {
    return false;
  }
  users_DB.splice(userIndex, 1);
  return true;
}
