import React, { useState, useEffect } from 'react';

const UniqueLoadingScreen = ({ message = "Connecting Colleges & Students", showLogo = true }) => {
  const [dots, setDots] = useState('');
  
  // Animated dots for the loading message
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return '';
        return prevDots + '.';
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ccx-loading-container">
      {showLogo && (
        <div className="ccx-logo-wrapper">
          <svg className="ccx-campus-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
          </svg>
        </div>
      )}
      
      <h1 className="ccx-main-title">Feedback Ranker</h1>
      
      {/* New spinner design */}
      <div className="ccx-spinner-wrapper">
        <div className="ccx-dot ccx-dot1"></div>
        <div className="ccx-dot ccx-dot2"></div>
        <div className="ccx-dot ccx-dot3"></div>
        <div className="ccx-dot ccx-dot4"></div>
      </div>
      
      <p className="ccx-status-message">{message}<span className="ccx-animated-dots">{dots}</span></p>
      
      <style jsx>{`
        .ccx-loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #004e92, #3a6ea5, #6699cc);
          background-size: 300% 300%;
          animation: ccx-bg-animation 8s ease infinite;
          color: white;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .ccx-logo-wrapper {
          margin-bottom: 1rem;
          animation: ccx-bounce 2s ease infinite;
        }
        
        .ccx-main-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          letter-spacing: 1px;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .ccx-status-message {
          font-size: 1.2rem;
          color: white;
          opacity: 0.9;
          margin-top: 1.5rem;
          font-weight: 400;
        }
        
        .ccx-animated-dots {
          display: inline-block;
          min-width: 24px;
          text-align: left;
        }
        
        .ccx-campus-icon {
          width: 64px;
          height: 64px;
          fill: currentColor;
          color: white;
        }
        
        /* New spinner design */
        .ccx-spinner-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .ccx-dot {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: white;
          animation: ccx-dot-pulse 1.5s ease-in-out infinite;
        }
        
        .ccx-dot1 {
          animation-delay: 0s;
          transform: translate(-20px, -20px);
        }
        
        .ccx-dot2 {
          animation-delay: 0.35s;
          transform: translate(20px, -20px);
        }
        
        .ccx-dot3 {
          animation-delay: 0.7s;
          transform: translate(20px, 20px);
        }
        
        .ccx-dot4 {
          animation-delay: 1.05s;
          transform: translate(-20px, 20px);
        }
        
        @keyframes ccx-dot-pulse {
          0%, 100% { transform: scale(0.6) translate(-20px, -20px); opacity: 0.6; }
          50% { transform: scale(1) translate(-20px, -20px); opacity: 1; }
        }
        
        @keyframes ccx-dot-pulse {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(0.6) translate(var(--tx, -20px), var(--ty, -20px));
          }
          50% { 
            opacity: 1;
            transform: scale(1) translate(var(--tx, -20px), var(--ty, -20px)); 
          }
        }
        
        .ccx-dot1 { --tx: -20px; --ty: -20px; }
        .ccx-dot2 { --tx: 20px; --ty: -20px; }
        .ccx-dot3 { --tx: 20px; --ty: 20px; }
        .ccx-dot4 { --tx: -20px; --ty: 20px; }
        
        @keyframes ccx-bounce {
          0%, 100% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes ccx-bg-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

// Demo component to showcase the loading screen
const UniqueCampusConnectDemo = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Connecting Colleges & Students");
  const [showLogo, setShowLogo] = useState(true);
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const toggleLoading = () => {
    setLoading(prev => !prev);
  };
  
  return (
    <div className="ccx-demo-wrapper">
      {loading ? (
        <UniqueLoadingScreen message={message} showLogo={showLogo} />
      ) : (
        <div className="ccx-controls-panel">
          <h1>Feedback Ranker Loading Demo</h1>
          
          <div className="ccx-control-item">
            <label>Custom Loading Message:</label>
            <input 
              type="text" 
              value={message} 
              onChange={handleMessageChange}
              placeholder="Enter loading message"
              className="ccx-text-input"
            />
          </div>
          
          <div className="ccx-control-item">
            <label>Show Logo:</label>
            <input 
              type="checkbox" 
              checked={showLogo} 
              onChange={() => setShowLogo(prev => !prev)}
              className="ccx-checkbox-input"
            />
          </div>
          
          <button onClick={toggleLoading} className="ccx-action-button">
            Show Loading Screen
          </button>
        </div>
      )}
      
      <style jsx>{`
        .ccx-demo-wrapper {
          font-family: 'Montserrat', -apple-system, sans-serif;
          height: 100vh;
          width: 100%;
          background-color: #f5f7fa;
        }
        
        .ccx-controls-panel {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 1.5rem;
        }
        
        .ccx-controls-panel h1 {
          color: #004e92;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .ccx-control-item {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        
        .ccx-control-item label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #3e4c59;
        }
        
        .ccx-text-input {
          padding: 0.75rem;
          border: 1px solid #cbd2d9;
          border-radius: 0.25rem;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        .ccx-text-input:focus {
          border-color: #6699cc;
          box-shadow: 0 0 0 3px rgba(102, 153, 204, 0.2);
          outline: none;
        }
        
        .ccx-checkbox-input {
          width: 20px;
          height: 20px;
        }
        
        .ccx-action-button {
          background: linear-gradient(135deg, #3a6ea5, #004e92);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
        }
        
        .ccx-action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        
        .ccx-action-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default UniqueLoadingScreen;