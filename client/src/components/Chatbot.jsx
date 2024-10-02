import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccpectTerms from "./Accpect_terms"; 

const Chatbot = () => {
  const navigate = useNavigate();
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("hasVisited");
    if (!consent) {
      setIsConsentGiven(false); 
    } else {
      setIsConsentGiven(true); 
    }
  }, []);

  const handleConsent = () => {
    setIsConsentGiven(true);
    localStorage.setItem("hasVisited", "true");
  };

  const handleDeny = () => {

    localStorage.removeItem("hasVisited"); 
    navigate("/");
  };

  return (
    <div>
      {!isConsentGiven ? (
        <AccpectTerms onConsent={handleConsent} onDeny={handleDeny} />
      ) : (
        <div>
          <h1>Emotion Detection Chatbot</h1>
          <p>This is your chatbot that analyzes emotions using AI!</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
