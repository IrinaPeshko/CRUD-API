import { IUser } from '../types/types';

let users_DB: IUser[] = [];

export const getUsersDB = () => users_DB;
export const changeUsersDB = (newUsers: IUser[]) => {
  users_DB = newUsers;
};

export const baseUrl = '/api/users';
export const urlWithIdRegExp =
  /^\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const methods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
};
