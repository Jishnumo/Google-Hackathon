import React from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const redirectToNextPage = () => {
    navigate("/draganddrop");
  };

  return (
    <section className="services">
      <h1>Our Services</h1>
      <div className="smain">
        <div className="container">
          <div className="imgcontainer">
            <img id="imageLink" src="assets/mental_health.png" alt="services" onClick={redirectToNextPage} />
          </div>
          <div className="ww">
            <h3 id="heading" onClick={redirectToNextPage}></h3>
            <p id="description" onClick={redirectToNextPage}>
              Healio.ai enhances emotional support by analyzing user-uploaded photos to detect emotions...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
