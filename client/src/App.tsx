import React from 'react';

function App() {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/test`)
    .then((res) => res.json())
    .then((qq) => console.log(qq));
  return <div className='App' />;
}

export default App;
