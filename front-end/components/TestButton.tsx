// src/components/ButtonWithClick.tsx

'use client'; // This directive marks the component as a Client Component

import React from 'react';
import axios from 'axios';

const ButtonWithClick: React.FC = () => {
  const sendHelloWorld = () => {
    axios.post('/api/text_prompt_api', {message: "What is a fish"}).then((res) => {
      console.log(res.data);
    });
  };

  return <button onClick={sendHelloWorld}>Test API</button>;
};

export default ButtonWithClick;
