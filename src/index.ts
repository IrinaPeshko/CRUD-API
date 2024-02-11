import http from 'http';
import { getAllUsers, getUserById } from './controllers/getUserController';
import { createUser } from './controllers/createUserController';
import 'dotenv/config';
import { baseUrl, methods, urlWithIdRegExp } from './Constants/apiConstants';
import { updateUser } from './controllers/updateUserController';
import { deleteUser } from './controllers/deleteUserController';

const server = http.createServer((req, res) => {
  if (req.url === baseUrl && req.method === methods.get) {
    getAllUsers(req, res);
  } else if (req.url?.match(urlWithIdRegExp) && req.method === methods.get) {
    const id = req.url.split('/')[3];
    getUserById(req, res, id);
  } else if (req.url === baseUrl && req.method === methods.post) {
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
    res.write(JSON.stringify({ message: 'Invalid request' }));
    res.end();
  }
});

const DEFAULT_PORT = 4000;
const PORT = process.env.PORT || DEFAULT_PORT;
server.listen(PORT, () => {
  `server start ${PORT}`;
});
