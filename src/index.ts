import 'dotenv/config';
import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import { handleRequest } from './utils/handleRequest';
import { balancer } from './balancer/balancer';

const DEFAULT_PORT = 4000;
const PORT: number = Number(process.env.PORT) || DEFAULT_PORT;
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  handleRequest(req, res);
});

if (process.env.CRUD_API_MODE === 'cluster') {
  balancer(server, PORT);
} else {
  server.listen(PORT, () => {
    console.log(`server start on port: ${PORT}`);
  });
}

export default server;
