import React, { useState, useRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@mui/material";

const AccpectTerms = ({ onConsent, onDeny }) => {
  const [isPhotoConsent, setIsPhotoConsent] = useState(false);
  const [isTermsConsent, setIsTermsConsent] = useState(false);

  // Use refs to focus on the checkbox elements
  const photoConsentRef = useRef(null);
  const termsConsentRef = useRef(null);

  const handleAllow = () => {
    if (isPhotoConsent && isTermsConsent) {
      onConsent(); // Call the passed onConsent handler from parent component
    } else {
      alert("You must agree to both terms and consent for photo capture to proceed.");
      // Focus on the first checkbox that is not checked
      if (!isPhotoConsent) {
        photoConsentRef.current.focus();
      } else if (!isTermsConsent) {
        termsConsentRef.current.focus();
      }
    }
  };

  const handleDeny = () => {
    onDeny(); // Call the passed onDeny handler from parent component
  };

  return (
    <AlertDialog.Root open={true}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">
            Welcome to Emotion Detection
          </AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">
            <p>
              This application uses facial recognition to analyze your emotions.
              Please review the following consent before proceeding:
            </p>
            <ul>
              <li>Your photo will be used only for emotion analysis within this application.</li>
              <li>We will not store or share your photo with any third parties.</li>
              <li>You can withdraw your consent at any time.</li>
            </ul>
            <div className="consent-checkbox">
              <input
                type="checkbox"
                id="consent-photo"
                ref={photoConsentRef} // Attach ref to photo consent checkbox
                checked={isPhotoConsent}
                onChange={(e) => setIsPhotoConsent(e.target.checked)}
              />
              <label htmlFor="consent-photo">
                I consent to the capture and use of my photo for emotion detection.
              </label>
            </div>
            <div className="consent-checkbox">
              <input
                type="checkbox"
                id="consent-terms"
                ref={termsConsentRef} // Attach ref to terms consent checkbox
                checked={isTermsConsent}
                onChange={(e) => setIsTermsConsent(e.target.checked)}
              />
              <label htmlFor="consent-terms">
                I have read and agree to the <a href="#">Terms of Service</a>.
              </label>
            </div>
          </AlertDialog.Description>
          <div className="flex justify-end gap-4">
            <AlertDialog.Cancel asChild>
              <Button variant="contained" onClick={handleDeny}>
                Deny
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="contained" color="primary" onClick={handleAllow}>
                Allow
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AccpectTerms;
