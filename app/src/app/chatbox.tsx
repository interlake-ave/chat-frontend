"use client";

import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import { io, Socket } from 'socket.io-client';
import './chatbox.css';

interface Message {
  id: number;
  timestamp: EpochTimeStamp;
  text: string;
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  // Initialize the WebSocket connection
  useEffect(() => {
    const getSocketUrl = () => {
      if (process.env.REACT_APP_ENV === "development") {
        console.log("localhost selected")
        return 'http://localhost:8080';
      } else {
        console.log("backend selected")
        return 'http://backend:8080';
      }
    };

    const newSocket = io(getSocketUrl());
    setSocket(newSocket);

    newSocket.on('message', (data: { data: string }) => {
      const newMessage: Message = {
        id: messages.length,
        text: data.data,
        timestamp: 0
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on('initial_messages', (initialMessages: Message[]) => {
      console.log("Getting initial messages", initialMessages);
      setMessages(initialMessages);
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Clean up the connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, [messages.length]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length,
        text: inputValue,
        timestamp: 0
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      socket?.emit('message', { data: inputValue });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="message-label">Message</div>
      <div className="chatbox">
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className="message">
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;

