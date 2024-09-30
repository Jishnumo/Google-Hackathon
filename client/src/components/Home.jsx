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
                <span>Use Standard Formats:</span> Upload the exam paper in a standard digital format such as PDF or image files (JPEG, PNG, etc.). Ensure that the entire paper is visible and not cropped or cut off. <br />
                <span>Single Document Upload:</span> Upload one exam paper at a time. Avoid uploading multiple papers simultaneously to prevent confusion and ensure accurate processing. <br />
                <span>Check for Completeness:</span> Verify that all pages of the exam paper are included in the upload. Missing pages can lead to incomplete grading. <br />
                <span>Follow Naming Conventions:</span> If there are specific naming conventions or instructions for naming the files, adhere to them. This helps in organizing and processing the uploaded papers efficiently. <br />
                <span>Review Guidelines:</span> Familiarize yourself with any specific guidelines or requirements provided by the automatic exam paper checker. Follow these guidelines to ensure smooth processing and accurate results.<br />
                <span>Privacy and Security:</span> Be mindful of any sensitive information present on the exam paper, such as student names or identification numbers. Ensure that such information is appropriately redacted or anonymized before uploading. <br />
                <span>Submit Corrections:</span> If any errors are identified after uploading, follow the designated procedure for submitting corrections or revisions. This may involve re-uploading the corrected version of the exam paper. <br />
                <span>Patience During Processing:</span> Understand that the automatic exam paper checker may take some time to process and grade the uploaded papers, especially during peak periods. Be patient and wait for the results to be generated. <br />
                <span>Contact Support if Needed:</span> If you encounter any technical issues or have questions about the uploading process, don't hesitate to contact customer support for assistance.
              </p>
              <button className="conttttt">
                <a href="/emotion-detection">Continue</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
