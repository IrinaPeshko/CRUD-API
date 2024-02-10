import http from 'http';
import { getAllUsers, getUserById } from './controllers/userController';

const server = http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    getAllUsers(req, res);
  } else if (req.url?.match(/\/api\/users\/[0-9]+/) && req.method === 'GET') {
    const id = req.url.split('/')[3];
    getUserById(req, res, id);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write('<h1>Users not found</h1>');
    res.end();
  }
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  `server start ${PORT}`;
});
