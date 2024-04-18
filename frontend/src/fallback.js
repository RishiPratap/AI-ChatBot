// FallbackPage.js
import React from 'react';

const FallbackPage = () => {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'lightgray',
        color: 'black',
        
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go back to home page</a>
    </div>
  );
};

export default FallbackPage;
