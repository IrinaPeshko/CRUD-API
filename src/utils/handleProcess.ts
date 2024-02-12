import { IncomingMessage, ServerResponse } from 'http';

const collectResponseData = (res: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];
    res.on('data', (chunk: Buffer) => data.push(chunk));
    res.on('end', () => resolve(Buffer.concat(data).toString()));
    res.on('error', (err: Error) => reject(err));
  });
};

export const processResponse = async (
  req: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  try {
    const body = await collectResponseData(req);
    response.end(body);
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};
