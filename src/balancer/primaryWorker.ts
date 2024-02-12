import os from 'os';
import cluster from 'cluster';
import http from 'http';
import { processResponse } from '../utils/handleProcess';
import { changeUsersDB } from '../Constants/apiConstants';
import { IUser } from '../types/types';

const numCPUs = os.cpus().length - 1;
export function startPrimaryWorker(PORT: number) {
  const workerPortsArray: number[] = [];
  for (let i = 0; i < numCPUs; i++) {
    cluster.schedulingPolicy = cluster.SCHED_RR;
    const childWorker = cluster.fork({ workerPort: PORT + 1 + i });
    workerPortsArray.push(PORT + 1 + i);
    childWorker.on('message', (message: IUser[]) => {
      changeUsersDB(message);
      for (let workerID = 0; workerID < numCPUs; workerID++) {
        const currentWorker = cluster.workers && cluster.workers[workerID + 1];
        if (currentWorker) {
          currentWorker.send(message);
        }
      }
    });
  }

  let index = 0;
  const balancer = http.createServer(
    async (req: http.IncomingMessage, resToClient: http.ServerResponse) => {
      const port = workerPortsArray[index++ % numCPUs];
      const { url, method, headers } = req;
      const options = {
        port,
        path: url,
        method,
        headers,
      };

      try {
        const requestToWorker = http.request(
          options,
          async (workerRes: http.IncomingMessage) => {
            await processResponse(workerRes, resToClient);
          },
        );

        requestToWorker.on('error', (error) => {
          console.error(error);
          resToClient.statusCode = 500;
          resToClient.end(JSON.stringify({ message: 'Internal Server Error' }));
        });

        requestToWorker.on('response', (response) => {
          resToClient.statusCode = response.statusCode!;
        });
        req.pipe(requestToWorker);
      } catch (error) {
        console.error(error);
        resToClient.statusCode = 500;
        resToClient.end(JSON.stringify({ message: 'Internal Server Error' }));
      }
    },
  );

  balancer.listen(PORT, () => {
    console.log(`Balancer ${process.pid} listen to port: ${PORT}`);
  });
}
