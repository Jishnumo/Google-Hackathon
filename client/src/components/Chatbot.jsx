import React from "react";

const Chatbot = () => {
  return (
    <div id="container">
      <div id="consent-section">
        <h1>Welcome to Emotion Detection</h1>
        <p>
          This application uses facial recognition to analyze your emotions. Please review the following consent before proceeding:
        </p>
        <ul>
          <li>Your photo will be used only for emotion analysis within this application.</li>
          <li>We will not store or share your photo with any third parties.</li>
          <li>You can withdraw your consent at any time.</li>
        </ul>
        <div className="consent-checkbox">
          <input type="checkbox" id="consent-photo" required />
          <label htmlFor="consent-photo">I consent to the capture and use of my photo for emotion detection.</label>
        </div>
        <div className="consent-checkbox">
          <input type="checkbox" id="consent-terms" required />
          <label htmlFor="consent-terms">
            I have read and agree to the <a href="#">Terms of Service</a>.
          </label>
        </div>
        <button id="consent-allow">Allow</button>
        <button id="consent-deny">Deny</button>
      </div>
    </div>
  );
};

export default Chatbot;
