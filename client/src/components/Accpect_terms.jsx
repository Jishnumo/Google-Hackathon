import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const AccpectTerms = ({ onConsent, onDeny }) => {
  const [open, setOpen] = React.useState(true);
  const [isPhotoConsent, setIsPhotoConsent] = React.useState(false);
  const [isTermsConsent, setIsTermsConsent] = React.useState(false);

  const handleAllow = () => {
    if (isPhotoConsent && isTermsConsent) {
      onConsent(); 
      setOpen(false);
    } else {
      alert("You must agree to both terms and consent for photo capture to proceed.");
    }
  };

  const handleDeny = () => {
    onDeny();
    setOpen(false); 
  };

  return (
    <div>

      <Dialog
        open={open} 
        onClose={handleDeny}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Welcome to Emotion Detection"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This application uses facial recognition to analyze your emotions. Please review the following consent before proceeding:
            <ul>
              <li>Your photo will be used only for emotion analysis within this application.</li>
              <li>We will not store or share your photo with any third parties.</li>
              <li>You can withdraw your consent at any time.</li>
            </ul>
          </DialogContentText>

          <div style={{ marginTop: "1rem" }}>
            <div>
              <input
                type="checkbox"
                id="consent-photo"
                checked={isPhotoConsent}
                onChange={(e) => setIsPhotoConsent(e.target.checked)}
              />
              <label htmlFor="consent-photo">
                I consent to the capture and use of my photo for emotion detection.
              </label>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="checkbox"
                id="consent-terms"
                checked={isTermsConsent}
                onChange={(e) => setIsTermsConsent(e.target.checked)}
              />
              <label htmlFor="consent-terms">
                I have read and agree to the <a href="#">Terms of Service</a>.
              </label>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeny}>Deny</Button>
          <Button onClick={handleAllow} autoFocus>
            Allow
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccpectTerms;
