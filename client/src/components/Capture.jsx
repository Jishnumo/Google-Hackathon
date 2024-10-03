import React, { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios for making requests

const Capture = ({ onCaptureComplete }) => {
  const videoRef = useRef(null); // Ref for video stream (hidden)
  const canvasRef = useRef(null); // Ref for canvas
  const mediaStreamRef = useRef(null); // Store the media stream

  useEffect(() => {
    startCamera(); // Start the camera when the component mounts

    return () => {
      stopCamera(); // Clean up camera stream on unmount
    };
  }, []);

  // Start the camera
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            videoRef.current.play();
            setTimeout(captureImage, 2000); // Capture after 2 seconds
          };
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Capture the image
  const captureImage = () => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        sendToBackend(blob); // Send the captured image to the backend
      } else {
        console.error("Failed to create image blob.");
      }
    }, "image/png");

    stopCamera();
  };

  // Send the image to the backend and call onCaptureComplete when successful
  const sendToBackend = async (imageBlob) => {
    const formData = new FormData();
    formData.append("file", imageBlob, "capture.png");

    try {
      const response = await axios.post("http://localhost:3000/api/emotion-check", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        console.log("Emotions detected:", response.data.emotions);
        toast.success("Emotion analysis successful!", { autoClose: 3000 });

        // Notify the parent that the capture and emotion detection is complete
        if (onCaptureComplete) {
          onCaptureComplete(response.data.emotions); // Pass the detected emotions
        }
      } else {
        toast.error(`Error analyzing the image. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <ToastContainer />
      <video ref={videoRef} autoPlay muted style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default Capture;
