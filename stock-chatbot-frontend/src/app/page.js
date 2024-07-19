"use client"

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RobotIcon from '@mui/icons-material/SmartToy';
import styles from './page.module.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [step, setStep] = useState('home');
  const chatWindowRef = useRef(null);

  useEffect(() => {
    setMessages([
            { type: 'bot', text: 'Select a Stock Exchange:' }
          ]);
  }, [])

  useEffect(() => {
    if (step === 'home') {
      axios.get('http://localhost:3001/api/exchanges')
        .then(response => {
          setOptions(response.data);
        })
        .catch(error => console.error('Error fetching exchanges:', error));
    }
  }, [step]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOptionClick = (option) => {
    if (step === 'home') {
      setStep(option.code);
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'user', text: option.name }
      ]);
      axios.get(`http://localhost:3001/api/exchanges/${option.code}/stocks`)
        .then(response => {
          setOptions(response.data);
          setMessages(prevMessages => [
            ...prevMessages,
            { type: 'bot', text: 'Select a stock:' }
          ]);
        })
        .catch(error => console.error('Error fetching stocks:', error));
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'user', text: option.stockName }
      ]);
      axios.get(`http://localhost:3001/api/stocks/${option.code}`)
        .then(response => {
          setMessages(prevMessages => [
            ...prevMessages,
            { type: 'bot', text: `Stock Price of ${response.data.stockName} is ${response.data.price}.` },
            { type: 'bot', text: 'Select a Stock Exchange:' }
          ]);
          setStep('home');
          axios.get('http://localhost:3001/api/exchanges')
            .then(res => setOptions(res.data))
            .catch(error => console.error('Error fetching exchanges:', error));
        })
        .catch(error => console.error('Error fetching stock details:', error));
    }
  };

  return (
    <div className={styles['chat-container']}>
      <h1 className={styles['header']}>Stock Chatbot</h1>
      <div className={styles['chat-window']} ref={chatWindowRef}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.type]}`}>
            {message.type === 'bot' && <RobotIcon className={styles['bot-icon']} />}
            {message.text}
          </div>
        ))}
      </div>
      {options.length > 0 && (
        <div className={styles['options-container']}>
          <div className={styles['options']}>
            {options.map(option => (
              <button
                key={option.code}
                className={styles['option-button']} 
                onClick={() => handleOptionClick(option)}
              >
                {step === 'home' ? option.name : option.stockName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
