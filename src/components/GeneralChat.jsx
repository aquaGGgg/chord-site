import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const GeneralChat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  // Создаем соединение при монтировании компонента
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chatHub') // замените на адрес вашего хаба
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Запускаем соединение и подписываемся на событие ReceiveMessage
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connected to chat hub');
          connection.on('ReceiveMessage', (user, text) => {
            setMessages(prev => [...prev, { user, text }]);
          });
        })
        .catch(e => console.error('Connection failed: ', e));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection && message) {
      try {
        // Вызываем метод на сервере. Здесь передаём имя пользователя и сообщение.
        await connection.invoke('SendMessage', username, message);
        setMessage('');
      } catch (error) {
        console.error('Ошибка при отправке сообщения: ', error);
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Общий чат</h3>
      <div style={messagesStyle}>
        {messages.map((msg, index) => (
          <div key={index} style={messageStyle}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={inputContainerStyle}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={inputStyle}
        />
        <button onClick={sendMessage} style={buttonStyle}>Отправить</button>
      </div>
    </div>
  );
};

const containerStyle = {
  width: '300px',
  backgroundColor: '#2a2e33',
  padding: '10px',
  color: '#fff',
  borderLeft: '1px solid #444',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};

const headerStyle = {
  margin: '0 0 10px 0',
  textAlign: 'center',
};

const messagesStyle = {
  flex: '1',
  overflowY: 'auto',
  backgroundColor: '#3a3f44',
  padding: '10px',
  borderRadius: '5px',
};

const messageStyle = {
  marginBottom: '8px',
};

const inputContainerStyle = {
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  marginBottom: '5px',
  padding: '5px',
  borderRadius: '4px',
  border: '1px solid #444',
};

const buttonStyle = {
  padding: '5px 10px',
  backgroundColor: '#4a90e2',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default GeneralChat;
