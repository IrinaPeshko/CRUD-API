import http from 'http';
import { validate as uuidValidate } from 'uuid';
import { updateUserModel } from '../models/userModel';
import { IUserToUpdate } from '../types/types';

export async function updateUser(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string,
) {
  try {
    if (!uuidValidate(userId)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Invalid UUID format' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const userData: IUserToUpdate = JSON.parse(body);

        const allowedFields = ['username', 'age', 'hobbies'];
        const fields = Object.keys(userData);
        if (!fields.every((field) => allowedFields.includes(field))) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid fields in user data' }));
          return;
        }

        if (userData.username) {
          if (!userData.username || typeof userData.username !== 'string') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid username' }));
            return;
          }
        }

        if (userData.age) {
          if (typeof userData.age !== 'number' || userData.age < 0) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid age' }));
            return;
          }
        }

        if (userData.hobbies) {
          if (
            !Array.isArray(userData.hobbies) ||
            !userData.hobbies.every((hobby) => typeof hobby === 'string')
          ) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid hobbies' }));
            return;
          }
        }

        const updateUser = await updateUserModel(userId, userData);
        if (!updateUser) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({ message: `User with id: '${userId}' not found` }),
          );
          return;
        }
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(updateUser));
        res.end();
      } catch (parseError) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid user data' }));
      }
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
