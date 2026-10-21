import { createServer } from '../backend/src/server.js';

let appPromise;

export default async function handler(req, res) {
  if (!appPromise) {
    appPromise = createServer();
  }
  const app = await appPromise;
  return app(req, res);
}
