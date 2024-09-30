import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const openPopup = () => {
    const popup = document.getElementById("contt");
    popup.classList.add("open-popup");
  };

  return (
    <section className="home">
      <h1 className="title">Healio.ai</h1>
      <div className="mmmm">
        <button className="btn" type="button" onClick={openPopup}>
          Start Now
        </button>
        <div className="main" id="contt">
          <div className="containerr">
            <div className="continue">
              <div className="cont"></div>
            </div>
            <div className="inst">
              <h1>INSTRUCTIONS</h1>
              <p>
                <span>Ensure Legibility:</span> Make sure the exam paper is clear and legible...
                {/* Add the rest of the instructions */}
              </p>
              <button className="conttttt">
                <a href="/chatbot">Continue</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
