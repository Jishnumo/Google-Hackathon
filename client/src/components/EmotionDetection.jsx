import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccpectTerms from "./Accpect_terms";
import Chatbot from "./Chatbot";
import Capture from "./Capture";

const EmotionDetection = () => {
  const navigate = useNavigate();
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState("");
  const [isCaptureComplete, setIsCaptureComplete] = useState(false);

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
    setDetectedEmotion(emotion);
    setIsCaptureComplete(true);
  };

  return (
    <div>
      {!isConsentGiven ? (
        <AccpectTerms onConsent={handleConsent} onDeny={handleDeny} />
      ) : (
        <>
          {!isCaptureComplete && <Capture onCaptureComplete={handleCaptureComplete} />}
          {isCaptureComplete && <Chatbot initialEmotion={detectedEmotion} />}
        </>
      )}
    </div>
  );
};

export default EmotionDetection;