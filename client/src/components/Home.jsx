import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../assets/StartBuilding_001_BG.png";
import animationData from "../assets/StartBuilding_001.json";
import { Player } from "@lottiefiles/react-lottie-player";

const Home = () => {
  const lottieRef = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    lottieRef.current.play(); // Play the animation on button click

    // Fallback timeout in case `onComplete` doesn't fire
    setTimeout(() => {
      console.log("Timeout triggered. Navigating to /chatbot");
      navigate("/chatbot");
    }, 2000); // Adjust this duration based on the length of your animation
  };

  const handleAnimationComplete = () => {
    navigate("/emotion-detection"); // Navigate to '/chatbot' after the animation completes
  };

  return (
    <div className="relative block w-full h-screen">
      <div className="flex justify-center items-center font-gsd h-screen sticky top-0 left-0 w-full">
        <div className="absolute inset-0 w-full h-screen overflow-hidden">
          <div className="w-calc-100plus300 md:w-full max-w-[initial]">
            {/* Lottie Animation */}
            <Player
              ref={lottieRef}
              src={animationData}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translate3d(0,-50%,0)",
              }}
              speed={1}
              loop={false} // Set loop to false to play the animation once
              onComplete={handleAnimationComplete} // Trigger navigation on complete
            />
            <img
              src={bgimg}
              alt="Line background"
              loading="lazy"
              height="500"
              className="absolute top-1/2 left-0 -translate-y-1/2 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col relative items-center justify-center  z-10 px-6">
          <div className="flex flex-col items-center gap-5 text-center">
            <h1 className="text-6xl font-bold text-[#c418e6e9]">Healio.ai</h1>
            <p className="text-[#929DAB] text-xl leading-[120%] max-w-[640px] md:max-w-[705px] px-9">
              Your AI Companion for Mindful Living and Emotional Wellness
            </p>
          </div>
          <button
            className="mt-10 bg-violet-600 text-white text-lg font-medium py-3 px-6 rounded-full hover:bg-violet-600 transition"
            onClick={handleButtonClick}
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
