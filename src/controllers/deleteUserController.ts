import http from 'http';
import { validate as uuidValidate } from 'uuid';
import { deleteUserModel } from '../models/userModel';

export async function deleteUser(
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

    const isExist = await deleteUserModel(userId);
    if (!isExist) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({ message: `The user with id '${userId}' not found` }),
      );
      return;
    }
    res.statusCode = 204;
    res.end();
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
