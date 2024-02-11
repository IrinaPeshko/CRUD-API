import http from 'http';
import { findAllUsers, findUserById } from '../models/userModel';
import { validate as uuidValidate } from 'uuid';

export async function getAllUsers(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const users = await findAllUsers();
  try {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(users));
    res.end();
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

export async function getUserById(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string,
) {
  try {
    if (!uuidValidate(id)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify({ message: 'Invalid UUID format' }));
      res.end();
      return;
    }
    const user = await findUserById(id);
    if (!user) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.write(
        JSON.stringify({ message: `The user with id: '${id}' not found` }),
      );
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(user));
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
