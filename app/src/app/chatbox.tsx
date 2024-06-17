"use client";

import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import './chatbox.css';

interface Message {
  id: number;
  text: string;
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length,
        text: inputValue,
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
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

