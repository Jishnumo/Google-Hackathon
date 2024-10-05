import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import LoadingGif from './LoadingGif';

const Capture = ({ onCaptureComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showGif, setShowGif] = useState(true);
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    let stream;
    if (isCapturing) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((videoStream) => {
          stream = videoStream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });

      const captureTimeout = setTimeout(() => {
        captureImage();
      }, 3000);

      return () => {
        clearTimeout(captureTimeout);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isCapturing]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        console.log("Image captured:", blob);
        toast.success("Image captured successfully!");
        sendToBackend(blob);
      }, 'image/png');
    }
  };

  const sendToBackend = async (imageBlob) => {
    const formData = new FormData();
    formData.append('image', imageBlob);

    try {
      const response = await axios.post('http://localhost:3000/api/emotion-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setShowGif(false);
      setIsCapturing(false);
      const emotion = response.data.emotion;
      console.log("Emotion detected:", emotion);

      toast.success("Emotion successfully analyzed!");
      onCaptureComplete(emotion);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      toast.error("Failed to analyze emotion");
    }
  };

  return (
    <div>
      {isCapturing && (
        <video ref={videoRef} width="640" height="480" autoPlay style={{ display: 'none' }} />
      )}
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} /> 
      {showGif && <LoadingGif />}
      <ToastContainer />
    </div>
  );
};

export default Capture;