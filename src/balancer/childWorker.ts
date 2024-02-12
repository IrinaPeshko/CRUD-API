import http from 'http';
import { changeUsersDB } from '../Constants/apiConstants';
import { IUser } from '../types/types';

export function startChildWorker(server: http.Server) {
  const workerPort = process.env.workerPort;
  if (!workerPort) {
    console.error(
      "Error: Worker port is not defined. Ensure that the 'workerPort' environment variable is correctly set.",
    );
    return;
  }
  server.listen(workerPort, () => {
    console.log(
      `Worker process ${process.pid} started and listening on port ${workerPort}`,
    );
  });

  process.on('message', (data: IUser[]) => changeUsersDB(data));
}
