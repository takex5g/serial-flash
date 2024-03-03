/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import './App.css';
import { MyAudio } from './utils/myAudio';
const audio_ctx = new AudioContext();

// const audio = new MyAudio(audio_ctx, '/pi.mp3');
const audios = [
  new MyAudio(audio_ctx, '/audio/1.mp3'),
  new MyAudio(audio_ctx, '/audio/2.mp3'),
  new MyAudio(audio_ctx, '/audio/3.mp3'),
  new MyAudio(audio_ctx, '/audio/4.mp3'),
  new MyAudio(audio_ctx, '/audio/5.mp3'),
  new MyAudio(audio_ctx, '/audio/6.mp3'),
  new MyAudio(audio_ctx, '/audio/7.mp3'),
];

const c = new WebSocket('wss://d2mlz4dv52k4e2.cloudfront.net/websocket');
function App() {
  const [serialPort, setSerialPort] = useState<any>(null);
  const [lastFlashDate, setLastFlashDate] = useState<Date | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  let serialPort2: any = null;
  useEffect(() => {
    c.onopen = (event) => console.debug(event);
    c.onerror = (error) => console.debug(error);
    c.onmessage = (event) => {
      console.log(event.data);
      console.debug('message', serialPort);
      writeSerial(serialPort);
      setLastFlashDate(new Date());
      setIsFlashing(true);

      audios[Math.floor(Math.random() * 7)].play();
      // datas = [...JSON.parse(event.data)];
    };
    c.onclose = () => {
      console.debug('close');
      c.close();
    };
  }, [serialPort]);

  //lastFlashDateから10ms経過したらフラッシュを終了する
  useEffect(() => {
    if (lastFlashDate) {
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [lastFlashDate]);

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
    // console.log(res);
  };

  window.onload = function () {
    console.log('onload');

    navigator.serial.addEventListener('connect', () => {
      // `e.target` に接続する、すなわち利用可能なポートのリストに加えます。
      // console.log(e.target);
    });

    navigator.serial.addEventListener('disconnect', () => {
      // `e.target` を利用可能なポートのリストから外します。
      // console.log(e.target);
    });

    navigator.serial.getPorts().then((ports: any) => {
      // ページの読み込み時、`ports` を用いて利用可能なポートのリストを初期化します。
      console.log(ports);
    });
  };
  const toConnect = async () => {
    console.log('connect serial port');
    navigator.serial.requestPort().then((port: any) => {
      console.log(port);
      port.open({ baudRate: 9600 });
      setSerialPort(port);
      serialPort2 = port;
    });
  };

  const writeSerial = async (port: any) => {
    console.log('write serial port');
    const writer = port.writable.getWriter();
    //randomで0~3の数値を生成
    const random = Math.floor(Math.random() * 4) + 1;
    console.log(random);
    writer.write(new TextEncoder().encode(random.toString()));
    writer.releaseLock();
  };
  return (
    <div
      className='bg'
      style={{ backgroundColor: isFlashing ? 'white' : 'black' }}
    >
      <div className='buttons'>
        <button onClick={() => post()}>Send Notification</button>
        <button
          onClick={() => {
            toConnect();
          }}
        >
          シリアル通信開始
        </button>
        <button
          onClick={() => {
            writeSerial(serialPort);
          }}
        >
          シリアル通信書き込み
        </button>
      </div>
    </div>
  );
}

export default App;
