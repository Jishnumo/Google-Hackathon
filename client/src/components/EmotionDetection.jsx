import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccpectTerms from "./Accpect_terms"; 
import Chatbot from "./Chatbot";

const EmotionDetection = () => {
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
        <>
        <Chatbot/>
        </>
      )}
    </div>
  );
};

export default EmotionDetection;
