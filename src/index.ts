import http from 'http';
import users from './data/users.json';

const server = http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(users));
    res.end();
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
