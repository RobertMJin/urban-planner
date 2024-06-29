// src/components/ButtonWithClick.tsx

'use client'; // This directive marks the component as a Client Component

import React from 'react';
import axios from 'axios';

const ButtonWithClick: React.FC = () => {
  const sendHelloWorld = () => {
    axios.get('/api/api_tester').then((res) => {
      console.log(res.data);
    });
  };

  return <button onClick={sendHelloWorld}>Test API</button>;
};

export default ButtonWithClick;
