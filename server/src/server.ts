import http from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';
// eslint-disable-next-line import/no-extraneous-dependencies
import { instrument } from '@socket.io/admin-ui';

const app = express();
const handleListen = () =>
  console.log(`Listening on http://localhost:${process.env.PORT}`);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.get('/test', (req, res) => res.json({ test: 'test' }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

server.listen(process.env.PORT, handleListen);
