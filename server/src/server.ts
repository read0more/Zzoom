import http from 'http';
import express from 'express';
import 'dotenv/config';
import { Server, Socket } from 'socket.io';
// eslint-disable-next-line import/no-extraneous-dependencies
import { instrument } from '@socket.io/admin-ui';

type TWebsocket = Socket & {
  nickname?: string;
};

const app = express();
const handleListen = () =>
  console.log(`Listening on http://localhost:${process.env.PORT}`);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', process.env.CLIENT_URL as string],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on('connection', (socket: TWebsocket) => {
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', `${socket.nickname}님이 퇴장하셨습니다.`)
    );
  });

  socket.on('join_room', (nickname: string, roomName: string) => {
    // eslint-disable-next-line no-param-reassign
    socket.nickname = nickname;
    socket.join(roomName);
    socket
      .to(roomName)
      .emit('welcome', `${socket.nickname}님이 입장하셨습니다.`);
  });

  socket.on(
    'new_message',
    (message: string, roomName: string, done: () => void) => {
      socket.to(roomName).emit('new_message', `${socket.nickname}: ${message}`);
      done();
    }
  );
});

server.listen(process.env.PORT, handleListen);
