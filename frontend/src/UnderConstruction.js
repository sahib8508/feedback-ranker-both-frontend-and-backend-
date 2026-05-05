import React from "react";
import "./UnderConstruction.css";
import { useNavigate } from "react-router-dom";

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div className="under-construction-container">
      <div className="construction-content">
        <div className="icon-container">
          🚧
        </div>
        <h1>Page Under Construction</h1>
        <p>We’re working hard to bring you something awesome! 🚀</p>
        <button onClick={() => navigate("/")} className="home-btn">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction;
