import { useEffect, useState } from 'react';

const useLiveFeed = () => {
  const [messages, setMessages] = useState([]);

useEffect(() => {
  const interval = setInterval(() => {
    setMessages((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        keyword: ['token', 'leak', 'api_key'][Math.floor(Math.random() * 3)],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        status: 'new',
      },
      ...prev,
    ]);
  }, 3000); // every 3 seconds

  return () => clearInterval(interval);
}, []);


  return messages;
};

export default useLiveFeed;
