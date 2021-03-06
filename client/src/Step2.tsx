import React, { useEffect, useRef, useState } from 'react';
import Video from './Video';

export default function Step2({
  backToIndex,
  chatList,
  sendMessage,
  myStream,
  peerStream,
}: {
  backToIndex: () => void;
  chatList: string[];
  sendMessage: (message: string) => void;
  myStream: MediaStream | null;
  peerStream: MediaStream | null;
}) {
  const [chat, setChat] = useState('');
  const [mute, setMute] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(chat);
    setChat('');
  };

  const handleMic = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((track) => {
      // eslint-disable-next-line no-param-reassign
      track.enabled = !track.enabled;
    });
    setMute(!mute);
  };

  const handleVideo = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((track) => {
      // eslint-disable-next-line no-param-reassign
      track.enabled = !track.enabled;
    });
    setCameraOff(!cameraOff);
  };

  return (
    <>
      <ul>
        {chatList.map((c, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>{c}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor='chat'>
          채팅
          <input
            id='chat'
            type='text'
            value={chat}
            onChange={({ target: { value } }) => setChat(value)}
            required
          />
        </label>
      </form>
      <div>
        <Video
          width={400}
          height={400}
          autoPlay
          playsInline
          srcObject={myStream}
        />
        <button type='button' onClick={handleMic}>
          {`소리 ${mute ? '켜기' : '끄기'}`}
        </button>
        <button type='button' onClick={handleVideo}>
          {`카메라 ${cameraOff ? '켜기' : '끄기'}`}
        </button>
        {/* todo: 카메라들 선택 되게. <select></select> */}
      </div>
      <div>
        <Video
          width={400}
          height={400}
          autoPlay
          playsInline
          srcObject={peerStream}
        />
      </div>

      <button type='button' onClick={backToIndex}>
        퇴장
      </button>
      <div>step2</div>
    </>
  );
}
