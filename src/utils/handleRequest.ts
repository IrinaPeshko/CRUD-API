import { IncomingMessage, ServerResponse } from 'node:http';
import { baseUrl, methods, urlWithIdRegExp } from '../Constants/apiConstants';
import { getAllUsers, getUserById } from '../controllers/getUserController';
import { createUser } from '../controllers/createUserController';
import { updateUser } from '../controllers/updateUserController';
import { deleteUser } from '../controllers/deleteUserController';

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (process.env.CRUD_API_MODE === 'cluster') {
    console.log(
      `Worker Log: Received ${req.method} request on ${req.url} | PID: ${process.pid} | Port: ${process.env.workerPort}`,
    );
  } else {
    console.log(
      `Server Log: Received ${req.method} request on ${req.url} | PID: ${process.pid} | Default Port: ${process.env.PORT || 4000}`,
    );
  }
  const url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url;
  if (url === baseUrl && req.method === methods.get) {
    getAllUsers(req, res);
  } else if (req.url?.match(urlWithIdRegExp) && req.method === methods.get) {
    const id = req.url.split('/')[3];
    getUserById(req, res, id);
  } else if (url === baseUrl && req.method === methods.post) {
    createUser(req, res);
    return;
  } else if (req.url?.match(urlWithIdRegExp) && req.method === methods.put) {
    const id = req.url.split('/')[3];
    updateUser(req, res, id);
    return;
  } else if (req.url?.match(urlWithIdRegExp) && req.method === methods.delete) {
    const id = req.url.split('/')[3];
    deleteUser(req, res, id);
    return;
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write(
      JSON.stringify({
        message: 'The requested resource was not found on this server.',
      }),
    );
    res.end();
  }
}
