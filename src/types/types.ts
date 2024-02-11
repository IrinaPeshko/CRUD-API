export interface IUserToCreate {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUser extends IUserToCreate {
  id: string;
}
