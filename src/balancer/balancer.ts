import http from 'http';
import cluster from 'cluster';
import { startPrimaryWorker } from './primaryWorker';
import { startChildWorker } from './childWorker';

export function balancer(server: http.Server, PORT: number) {
  if (cluster.isPrimary) {
    startPrimaryWorker(PORT);
  } else {
    startChildWorker(server);
  }
}
