let mediaStream;
let capturedImage;

document.getElementById('consent-allow').addEventListener('click', function() {
    if (document.getElementById('consent-photo').checked && document.getElementById('consent-terms').checked) {
        document.getElementById('consent-section').style.display = 'none';
        document.getElementById('photo-section').style.display = 'block';
        startCamera();
    } else {
        alert("Please accept all consents before proceeding.");
    }
});

document.getElementById('consent-deny').addEventListener('click', function() {
    alert('You denied the consent. The system will not take your photo.');
});

document.getElementById('capture-photo').addEventListener('click', function() {
    captureImage();
});

function startCamera() {
    const videoElement = document.getElementById('video');
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                mediaStream = stream;
                videoElement.srcObject = stream;
            })
            .catch(function(err) {
                console.log("Error accessing camera: " + err);
                document.getElementById('gemini-result').innerHTML = "Error accessing camera. Please check your camera settings.";
            });
    }
}

function captureImage() {
    const videoElement = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Set the canvas dimensions to match the video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Get the captured image data as a base64 string
    capturedImage = canvas.toDataURL('image/png').split(',')[1]; // Get only the base64 data

    stopCamera();

    document.getElementById('photo-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    sendImageToBackend(); // Send image to backend
}

function stopCamera() {
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

// Send the captured image to the backend
async function sendImageToBackend() {
    try {
        const response = await fetch('/process-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: capturedImage })
        });

        if (response.ok) {
            const result = await response.json();
            displayGeminiResult(result);
        } else {
            document.getElementById('gemini-result').innerHTML = `Error processing the image: ${response.statusText}`;
        }
    } catch (error) {
        document.getElementById('gemini-result').innerHTML = `Error: ${error.message}`;
    }
}

// Display the Gemini API response
function displayGeminiResult(result) {
    const resultDiv = document.getElementById('gemini-result');
    resultDiv.innerHTML = `Gemini Response: <br> ${result.generatedContent}`;
}

document.getElementById('restart').addEventListener('click', function() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('consent-section').style.display = 'block';
});
