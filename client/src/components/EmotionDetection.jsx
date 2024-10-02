import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccpectTerms from "./Accpect_terms";
import Chatbot from "./Chatbot";
import Capture from "./Capture";

const EmotionDetection = () => {
  const navigate = useNavigate();
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false); // Manage chatbot visibility
  const [detectedEmotion, setDetectedEmotion] = useState(""); // Store detected emotion

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

  const handleCaptureComplete = (emotion) => {
    // Store detected emotion
    setDetectedEmotion(emotion);

    // Delay the chatbot appearance by 3 seconds (3000ms)
    setTimeout(() => {
      setShowChatbot(true);
    }, 3000);
  };

  return (
    <div>
      {!isConsentGiven ? (
        <AccpectTerms onConsent={handleConsent} onDeny={handleDeny} />
      ) : (
        <>
          <Capture onCaptureComplete={handleCaptureComplete} />
          {/* Conditionally render Chatbot after delay and pass detected emotion */}
          {showChatbot && <Chatbot detectedEmotion={detectedEmotion} />}
        </>
      )}
    </div>
  );
};

export default EmotionDetection;
