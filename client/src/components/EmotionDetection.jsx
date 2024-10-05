import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccpectTerms from "./Accpect_terms";
import Chatbot from "./Chatbot";
import Capture from "./Capture";

const EmotionDetection = () => {
  const navigate = useNavigate();
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(""); // Store detected emotion
  const [isCaptureComplete, setIsCaptureComplete] = useState(false); // Flag to check if capture is done

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

  // Callback function to handle when capture and emotion analysis is complete
  const handleCaptureComplete = (emotion) => {
    setDetectedEmotion(emotion); // Set the detected emotion from Capture.js
    setIsCaptureComplete(true); // Capture is done, activate chatbot
  };

  return (
    <div>
      {!isConsentGiven ? (
        <AccpectTerms onConsent={handleConsent} onDeny={handleDeny} />
      ) : (
        <>
          {/* Capture component will pass emotion back when done */}
          <Capture onCaptureComplete={handleCaptureComplete} />

          {/* Chatbot activates only after capture and emotion detection is complete */}
          {isCaptureComplete && <Chatbot initialEmotion={detectedEmotion} />}
        </>
      )}
    </div>
  );
};

export default EmotionDetection;
