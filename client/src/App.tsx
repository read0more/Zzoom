import React, { useRef, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Step1 from './Step1';
import Step2 from './Step2';

function App({ socket }: { socket: Socket }) {
  const [step, setStep] = useState(1);
  const [currRoomName, setCurrRoomName] = useState('');
  const [myStream, setMyStream] = useState<null | MediaStream>(null);
  const [peerStream, setPeerStream] = useState<null | MediaStream>(null);
  const [chatList, setChatList] = useState<string[]>([]);
  const [myPeerConnection, setMyPeerConnection] =
    useState<null | RTCPeerConnection>(null);

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
      console.log('media 가져옴');
      // if (!deviceId) {
      //   await getCameras();
      // }

      setMyStream(stream);
    } catch (e) {
      console.log(e);
    }
  }

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

  // useEffect(() => {
  //   getMedia();
  // }, []);

  useEffect(() => {
    if (!myStream) return;
    console.log('mystream 세트');
    setMyPeerConnection(new RTCPeerConnection());
  }, [myStream]);

  useEffect(() => {
    if (!myPeerConnection || !myStream) return;
    console.log('mypeer 세트');
    myPeerConnection.addEventListener('icecandidate', (data) => {
      console.log('icecandi', data);
      socket.emit('ice', data.candidate, currRoomName);
    });
    myPeerConnection.addEventListener('track', (data) => {
      console.log('track', data);
      setPeerStream(data.streams[0]);
    });

    myStream.getTracks().forEach((track) => {
      myPeerConnection.addTrack(track, myStream);
    });

    socket.on('welcome', async () => {
      console.log('welcome');
      const startCall = async () => {
        const offer = await myPeerConnection.createOffer();
        myPeerConnection.setLocalDescription(offer);
        socket.emit('offer', offer, currRoomName);
      };

      socket.on('ready_call', async () => {
        console.log('ready');
        await startCall();
        socket.off('ready_call');
      });
    });

    socket.on('offer', async (offer) => {
      console.log('offer', offer);
      myPeerConnection.setRemoteDescription(offer);
      const answer = await myPeerConnection.createAnswer();
      myPeerConnection.setLocalDescription(answer);
      socket.emit('answer', answer, currRoomName);
    });

    socket.on('answer', (answer) => {
      console.log('ans', answer);
      myPeerConnection.setRemoteDescription(answer);
    });

    socket.on('ice', (ice) => {
      console.log('ice', ice);
      myPeerConnection.addIceCandidate(ice);
    });

    socket.emit('ready_call', currRoomName);
  }, [myPeerConnection]);

  const joinRoom = async (nickname: string, roomName: string) => {
    await getMedia();
    setCurrRoomName(roomName);
    setStep(2);
    socket.emit('join_room', nickname, roomName);
  };

  return (
    <main>
      {step === 1 ? (
        <Step1 joinRoom={joinRoom} />
      ) : (
        <Step2
          backToIndex={() => {}}
          sendMessage={sendMessage}
          chatList={chatList}
          myStream={myStream}
          peerStream={peerStream}
        />
      )}
    </main>
  );
}

export default App;
