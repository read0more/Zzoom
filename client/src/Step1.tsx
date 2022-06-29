import React, { useState } from 'react';

export default function Step1({
  joinRoom,
}: {
  joinRoom: (nickname: string, roomName: string) => void;
}) {
  const [nickname, setNickname] = useState('');
  const [roomNameInput, setRoomNameInput] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    joinRoom(nickname, roomNameInput);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='nickname'>
        닉네임 설정
        <input
          id='nickname'
          type='text'
          value={nickname}
          onChange={({ target: { value } }) => setNickname(value)}
          required
        />
      </label>

      <label htmlFor='roomName'>
        방 이름
        {/* todo: 나중엔 select box로 있는 방들 보여주고, 기본은 새로 생성하게. */}
        <input
          id='roomName'
          type='text'
          value={roomNameInput}
          onChange={({ target: { value } }) => setRoomNameInput(value)}
          required
        />
      </label>

      <button type='submit'>입장</button>
    </form>
  );
}
