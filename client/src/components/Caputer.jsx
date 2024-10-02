import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios for making requests

const Capture = ({ onCaptureComplete }) => {
  const videoRef = useRef(null); // Ref for video stream (hidden)
  const canvasRef = useRef(null); // Ref for canvas
  const mediaStreamRef = useRef(null); // Store the media stream
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Track if video is playing

  useEffect(() => {
    startCamera(); // Start the camera when the component mounts

    return () => {
      stopCamera(); // Clean up camera stream on unmount
    };
  }, []);

  // Start the camera and make sure the video is ready
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          videoRef.current.srcObject = stream;

          // Wait for the video to start playing before capturing
          videoRef.current.onloadeddata = () => {
            videoRef.current.play();
            setIsVideoPlaying(true); // Video is ready
            // Capture the image after a delay to ensure the video is playing
            setTimeout(captureImage, 2000); // Capture after 2 seconds
          };
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
    if (!videoElement || videoElement.readyState !== 4) {
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

        // Call onCaptureComplete when the process is done
        if (onCaptureComplete) {
          onCaptureComplete(); // Notify parent that capture is complete
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
