import React, { useState, useEffect } from 'react';

const clockStyle = {
  fontSize: '2rem',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  backgroundColor: '#C5D098', // Updated background color to a vibrant shade of blue
  color: '#ffffff', // Updated font color to white
  borderRadius: '5px',
  padding: '10px 20px',
  width: '180px',
  textAlign: 'center',
};

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={clockStyle}>
      <p>{formatTime(time)}</p>
    </div>
  );
}
