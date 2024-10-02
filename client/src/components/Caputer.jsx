import React, { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

const Capture = () => {
  const videoRef = useRef(null); // Ref for video stream (hidden)
  const canvasRef = useRef(null); // Ref for canvas
  const mediaStreamRef = useRef(null); // Store the media stream

  useEffect(() => {
    startCamera(); // Start the camera when the component mounts

    // Automatically capture image after 5 seconds
    const timer = setTimeout(() => {
      captureImage();
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

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

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

  return (
    <>
      <ToastContainer />

      {/* Video stream for capturing the image (hidden) */}
      <video ref={videoRef} autoPlay muted style={{ display: "none" }}></video>

      {/* Canvas to process the captured image (hidden) */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default Capture;
