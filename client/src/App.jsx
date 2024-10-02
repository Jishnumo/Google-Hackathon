import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import Chatbot from "./components/Chatbot";
import EmotionDetection from "./components/EmotionDetection";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/emotion-detection" element={<EmotionDetection />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
