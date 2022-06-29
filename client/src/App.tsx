import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Step1 from './Step1';
import Step2 from './Step2';

function App({ socket }: { socket: Socket }) {
  const [step, setStep] = useState(1);
  const [currRoomName, setcurrRoomName] = useState('');
  // todo: chat에 타입을 줘서 스타일을 다르게
  const [chatList, setChatList] = useState<string[]>([]);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  async function getCameras(stream: MediaStream) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      const currentCamera = stream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        console.log(camera);
        // todo: 카메라 리스트 받아오고, 현재 카메라랑 같으면 선택
        /*
          if (currentCamera.label === camera.label) {
           option.selected = true;
          }
        */
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function getMedia(deviceId?: string) {
    const initialConstrains = {
      audio: true,
      video: { facingMode: 'user' },
    };
    const cameraConstraints = {
      audio: true,
      video: { deviceId: { exact: deviceId } },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstraints : initialConstrains
      );

      if (!deviceId) {
        await getCameras(stream);
      }
      setMyStream(stream);
    } catch (e) {
      console.log(e);
    }
  }

  const joinRoom = async (nickname: string, roomName: string) => {
    socket.emit('join_room', nickname, roomName);
    setcurrRoomName(roomName);
    await getMedia();
    setStep(2);
  };

  const sendMessage = (message: string) => {
    socket.emit('new_message', message, currRoomName, () => {
      const newMessage = `You: ${message}`;
      setChatList([...chatList, newMessage]);
    });
  };

  socket.on('welcome', (message: string) => {
    setChatList([...chatList, message]);
  });

  socket.on('new_message', (message: string) => {
    setChatList([...chatList, message]);
  });

  socket.on('bye', (message: string) => {
    setChatList([...chatList, message]);
  });

  return (
    <main>
      {step === 1 ? (
        <Step1 joinRoom={joinRoom} />
      ) : (
        <Step2
          backToIndex={() => setStep(1)}
          chatList={chatList}
          sendMessage={sendMessage}
          myStream={myStream}
        />
      )}
    </main>
  );
}

export default App;
