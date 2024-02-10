import users from '../data/users.json';

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
