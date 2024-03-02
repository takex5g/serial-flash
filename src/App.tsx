import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const c = new WebSocket('wss://d2mlz4dv52k4e2.cloudfront.net/websocket');
  c.onopen = (event) => console.debug(event);
  c.onerror = (error) => console.debug(error);
  c.onmessage = (event) => {
    console.log(event.data);
    // datas = [...JSON.parse(event.data)];
  };
  c.onclose = () => {
    console.debug('close');
    c.close();
  };
  const post = async () => {
    const res = await fetch(
      'https://d2mlz4dv52k4e2.cloudfront.net/send_notification',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(res);
  };
  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
