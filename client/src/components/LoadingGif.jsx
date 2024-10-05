import React from 'react';
import facescannobg from "../assets/facescannobg.gif";

const LoadingGif = () => {
  return (
    <div className="absolute top-0 w-full flex justify-center pt-4 -z-40">
      <img src={facescannobg} alt="Face ID Animation" className="w-20 h-20" />
    </div>
  );
};

export default LoadingGif;
