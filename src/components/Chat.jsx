import React, { useState, useEffect, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    console.log('Создаём подключение...');
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:55184/chatHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      console.log('Запускаем подключение...');
      connection.start()
        .then(() => {
          console.log('Успешное подключение!');
          connection.on('ReceiveMessage', (sender, msg) => {
            console.log('Новое сообщение:', sender, msg);
            setMessages(prev => [...prev, { sender, msg }]);
          });
        })
        .catch(error => console.error('Ошибка подключения:', error));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection && message.trim()) {
      try {
        const senderName = user?.username || user?.email || 'Аноним';
        await connection.invoke('SendMessage', senderName, message);
        setMessage('');
      } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
      }
    }
  };

  return (
    <div>
      <h3>Чат</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.sender}:</strong> {msg.msg}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Введите сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
};

export default Chat;
