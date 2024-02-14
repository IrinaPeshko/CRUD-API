import { changeUsersDB, getUsersDB } from '../Constants/apiConstants';
import { IUser, IUserToCreate, IUserToUpdate } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import cluster from 'cluster';

export async function findAllUsers() {
  const users_DB = getUsersDB();
  return users_DB;
}

export async function findUserById(id: string) {
  const users_DB = getUsersDB();
  const user = users_DB.find((el) => el.id === id);
  return user;
}

export async function createUserModel(user: IUserToCreate) {
  const users_DB = getUsersDB();
  const newUser: IUser = {
    id: uuidv4(),
    ...user,
  };
  users_DB.push(newUser);
  if (cluster.isWorker && process.send) {
    process.send(users_DB);
  }
  changeUsersDB(users_DB);
  return newUser;
}

export async function updateUserModel(id: string, newUserData: IUserToUpdate) {
  const users_DB = getUsersDB();
  const userIndex = users_DB.findIndex((el) => el.id === id);
  if (userIndex === -1) {
    return null;
  }
  const updateUser = { ...users_DB[userIndex], ...newUserData };
  users_DB[userIndex] = updateUser;
  if (cluster.isWorker && process.send) {
    process.send(users_DB);
  }
  changeUsersDB(users_DB);
  return updateUser;
}

export async function deleteUserModel(id: string) {
  const users_DB = getUsersDB();
  const userIndex = users_DB.findIndex((el) => el.id === id);
  if (userIndex === -1) {
    return false;
  }
  users_DB.splice(userIndex, 1);
  if (cluster.isWorker && process.send) {
    process.send(users_DB);
  }
  changeUsersDB(users_DB);
  return true;
}
