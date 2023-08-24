import React from 'react';
import Clock from './Clock';
import { Link } from 'react-router-dom';

export default function Main() {
  const titleStyle = {
    fontSize: '3rem',
    textDecoration: 'none',
  };

  const commonButtonStyle = {
    fontSize: '2rem',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#576618', // 576618, 87CEEB
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
    margin: '10px',
  };

  const mainContainerStyle = {
    position: 'relative',
    background: '#F5F5F5',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#CCCCCC',
    margin: '10px 0',
  };

  return (
    <div style={mainContainerStyle}>
      <h1 style={titleStyle}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          수철형님과 아이들
        </Link>
      </h1>
      <div>
        <Link to="/board" style={commonButtonStyle}>
          게시판 입장
        </Link>
        <Link to="/playlist" style={commonButtonStyle}>
          플레이리스트 입장
        </Link>
      </div>
      <div style={dividerStyle}></div>
      <div style={dividerStyle}></div>
      <h1>현재 시간</h1>
      <Clock/>
    </div>
  );
}

