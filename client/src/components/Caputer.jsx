import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios for making requests

const Capture = () => {
  const videoRef = useRef(null); // Ref for video stream (hidden)
  const canvasRef = useRef(null); // Ref for canvas
  const mediaStreamRef = useRef(null); // Store the media stream
  const [capturedImage, setCapturedImage] = useState(null); // State to hold captured image

  useEffect(() => {
    startCamera(); // Start the camera when the component mounts

    const timer = setTimeout(() => {
      captureImage(); // Automatically capture image after 5 seconds
    }, 5000);

    return () => {
      stopCamera(); // Clean up camera stream on unmount
      clearTimeout(timer); // Clear the timer on unmount
    };
  }, []);

  // Start the camera without showing the video
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
          toast.error("Error accessing camera. Please check your camera settings.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Capture an image from the video stream
  const captureImage = () => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Ensure the video is loaded
    if (videoElement.readyState !== 4) {
      console.error("Video not ready for capture.");
      return;
    }

    // Set canvas dimensions equal to video dimensions
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas data to Blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url); // Set the captured image for preview
        sendToBackend(blob); // Send the captured image to the backend
      } else {
        console.error("Failed to create image blob.");
      }
    }, "image/png");

    // Stop the camera after capturing the image
    stopCamera();

    // Show a success toast using Toastify
    toast.success("Image successfully captured!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Send the captured image to the backend
  const sendToBackend = async (imageBlob) => {
    const formData = new FormData();
    formData.append("file", imageBlob, "capture.png");

    try {
      const response = await axios.post("http://localhost:3000/api/emotion-check", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Server Response:", response.data);

        toast.success("Emotion analysis successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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

      {/* Video stream for capturing the image (hidden) */}
      <video ref={videoRef} autoPlay muted style={{ display: "none" }}></video>

      {/* Canvas to process the captured image (hidden) */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* Display the captured image */}
      {capturedImage && (
        <div className="preview-section">
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" style={{ width: "300px", height: "auto" }} />
        </div>
      )}
    </>
  );
};

export default Capture;
