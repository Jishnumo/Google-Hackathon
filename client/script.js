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
                document.getElementById('emotion-result').innerHTML = "Error accessing camera. Please check your camera settings.";
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
    analyzeEmotion();  // Send the image to the backend for emotion analysis
}

function stopCamera() {
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

async function analyzeEmotion() {
    try {
        const apiResponse = await fetch('/api/detect_emotion', {  // Flask endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: capturedImage })  // Send the base64 image
        });

        if (apiResponse.ok) {
            const result = await apiResponse.json();
            displayEmotionResult(result);
        } else {
            const errorText = await apiResponse.text(); // Get error details
            document.getElementById('emotion-result').innerHTML = `Error analyzing the image. Status: ${apiResponse.status} - ${apiResponse.statusText}`;
        }
    } catch (error) {
        document.getElementById('emotion-result').innerHTML = `Error: ${error.message}`;
    }
}

function displayEmotionResult(result) {
    const resultDiv = document.getElementById('emotion-result');
    resultDiv.innerHTML = `Detected emotion: ${result.emotion}`;
    resultDiv.innerHTML += `<br> Recommendation: ${result.recommendation}`;
}

document.getElementById('restart').addEventListener('click', function() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('consent-section').style.display = 'block';
});
