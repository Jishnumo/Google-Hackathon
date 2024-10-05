import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import LoadingGif from './LoadingGif';

const Capture = ({ onCaptureComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showGif, setShowGif] = useState(true);//faceID

  useEffect(() => {
    // Request webcam access
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });

    // Automatically capture the image after a few seconds (e.g., 3 seconds)
    const captureTimeout = setTimeout(() => {
      captureImage();
    }, 3000);

    return () => {
      clearTimeout(captureTimeout);
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height); // Capture frame from video

      // Convert canvas to a Blob (image file) for sending to the backend
      canvas.toBlob((blob) => {
        console.log("Image captured:", blob); // Debugging
        toast.success("Image captured successfully!");

      

        // Send the image to the backend
        sendToBackend(blob);
      }, 'image/png');
    }
  };

  const sendToBackend = async (imageBlob) => {
    const formData = new FormData();
    formData.append('image', imageBlob); // Append image file to the form data

    try {
      // Post the image to the backend API
      const response = await axios.post('http://localhost:3000/api/emotion-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setShowGif(false);
      const emotion = response.data.emotion; 
      console.log("Emotion detected:", emotion); // Debugging: Print the emotion

      // Store emotion in sessionStorage
      // sessionStorage.setItem("detectedEmotion", emotion); 

      // Show success notification
      toast.success("Emotion successfully analyzed!");

      // Notify parent component that capture and emotion analysis is complete
      onCaptureComplete(emotion);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      toast.error("Failed to analyze emotion");
    }
  };

  return (
    <div>
      {/* Hide the video element using inline styles */}
      <video ref={videoRef} width="640" height="480" autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} /> 

      {showGif && <LoadingGif />}
      
      <ToastContainer /> {/* Container to show notifications */}
    </div>
  );
};

export default Capture;
