import http from 'http';
import { createUserModel } from '../models/userModel';

export async function createUser(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);

        const allowedFields = ['username', 'age', 'hobbies'];
        const fields = Object.keys(userData);
        if (!fields.every((field) => allowedFields.includes(field))) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid fields in user data' }));
          return;
        }
        const { username, age, hobbies } = userData;

        if (!username || typeof username !== 'string') {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid username' }));
          return;
        }

        if (typeof age !== 'number' || age < 0) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid age' }));
          return;
        }

        if (
          !Array.isArray(hobbies) ||
          !hobbies.every((hobby) => typeof hobby === 'string')
        ) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid hobbies' }));
          return;
        }

        const newUser = await createUserModel({ username, age, hobbies });
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(newUser));
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
