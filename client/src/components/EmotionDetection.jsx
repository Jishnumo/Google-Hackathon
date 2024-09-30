import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const EmotionDetection = () => {
  const [consentGiven, setConsentGiven] = useState(false); // For managing consent
  const [photoCaptured, setPhotoCaptured] = useState(false); // To toggle sections
  const [emotionResult, setEmotionResult] = useState(""); // For storing the result
  const [loading, setLoading] = useState(false); // Loading state for the request

  const videoRef = useRef(null); // For accessing the video element
  const canvasRef = useRef(null); // For accessing the canvas element
  const mediaStreamRef = useRef(null); // To store media stream

  useEffect(() => {
    if (consentGiven && !photoCaptured) {
      startCamera();
    }
    return () => stopCamera(); // Cleanup camera on unmount
  }, [consentGiven, photoCaptured]);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
          setEmotionResult("Error accessing camera. Please check your camera settings.");
        });
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert the captured image to a blob for form submission
    canvas.toBlob((blob) => {
      sendToBackend(blob);
    }, "image/png");

    stopCamera();
    setPhotoCaptured(true);
  };

  const sendToBackend = async (imageBlob) => {
    setLoading(true); // Set loading to true
    const formData = new FormData();
    formData.append("file", imageBlob, "captured.png"); // Append image as file
    formData.append("prompt", "Analyze the emotions in this image");

    try {
      const response = await axios.post("http://localhost:3000/api/emotion-check", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setEmotionResult(response.data.message); // Set the result from the response
      } else {
        setEmotionResult(`Error analyzing the image. Status: ${response.status}`);
      }
    } catch (error) {
      setEmotionResult(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleConsent = () => {
    const consentPhoto = document.getElementById("consent-photo").checked;
    const consentTerms = document.getElementById("consent-terms").checked;

    if (consentPhoto && consentTerms) {
      setConsentGiven(true);
    } else {
      alert("Please accept all consents before proceeding.");
    }
  };

  const resetProcess = () => {
    setPhotoCaptured(false);
    setConsentGiven(false);
    setEmotionResult("");
  };

  return (
    <div id="container">
      {!consentGiven ? (
        <div id="consent-section">
          <h1>Welcome to Emotion Detection</h1>
          <p>
            This application uses facial recognition to analyze your emotions. Please review the following consent before proceeding:
          </p>
          <ul>
            <li>Your photo will be used only for emotion analysis within this application.</li>
            <li>We will not store or share your photo with any third parties.</li>
            <li>You can withdraw your consent at any time.</li>
          </ul>
          <div className="consent-checkbox">
            <input type="checkbox" id="consent-photo" />
            <label htmlFor="consent-photo">I consent to the capture and use of my photo for emotion detection.</label>
          </div>
          <div className="consent-checkbox">
            <input type="checkbox" id="consent-terms" />
            <label htmlFor="consent-terms">
              I have read and agree to the <a href="#">Terms of Service</a>.
            </label>
          </div>
          <button id="consent-allow" onClick={handleConsent}>
            Allow
          </button>
          <button id="consent-deny" onClick={() => alert("You denied the consent.")}>
            Deny
          </button>
        </div>
      ) : !photoCaptured ? (
        <div id="photo-section">
          <h2>Capture Your Photo</h2>
          <video id="video" ref={videoRef} width="320" height="240" autoPlay muted></video>
          <button id="capture-photo" onClick={captureImage}>
            Capture Photo
          </button>
          <canvas id="canvas" ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
      ) : (
        <div id="result-section">
          <h2>Emotion Analysis Results</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div id="emotion-result">{emotionResult}</div>
          )}
          <button id="restart" onClick={resetProcess}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionDetection;
