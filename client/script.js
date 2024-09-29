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
    analyzeEmotion();
}

function stopCamera() {
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

async function analyzeEmotion() {
    const apiKey = 'AIzaSyDYcB93cc4t_EcNeOHYbD9-eca1jIBX5wg'; // Replace with your actual API key
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
        requests: [
            {
                image: {
                    content: capturedImage // Pass the base64 data
                },
                features: [
                    {
                        type: 'FACE_DETECTION',
                        maxResults: 1
                    }
                ]
            }
        ]
    };

    console.log('Request Body:', JSON.stringify(requestBody)); // Log the request body

    try {
        console.log('Sending image to API...');
        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        });

        if (apiResponse.ok) {
            console.log('API response received');
            const result = await apiResponse.json();
            console.log('API Result:', result); // Log the result
            displayEmotionResult(result);
        } else {
            const errorText = await apiResponse.text(); // Get error details
            console.error('Error:', apiResponse.status, apiResponse.statusText, errorText);
            document.getElementById('emotion-result').innerHTML = `Error analyzing the image. Status: ${apiResponse.status} - ${apiResponse.statusText}`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('emotion-result').innerHTML = `There was an error connecting to the API. Error: ${error.message}`;
    }
}

function displayEmotionResult(result) {
    const resultDiv = document.getElementById('emotion-result');
    
    if (result.responses && result.responses[0].faceAnnotations && result.responses[0].faceAnnotations.length > 0) {
        const face = result.responses[0].faceAnnotations[0];
        resultDiv.innerHTML = `Detected emotions:`;
        resultDiv.innerHTML += `<br> Joy: ${face.joyLikelihood}`;
        resultDiv.innerHTML += `<br> Sorrow: ${face.sorrowLikelihood}`;
        resultDiv.innerHTML += `<br> Anger: ${face.angerLikelihood}`;
        resultDiv.innerHTML += `<br> Surprise: ${face.surpriseLikelihood}`;
    } else {
        resultDiv.innerHTML = `No face detected in the image.`;
    }
}

// Restart button functionality
document.getElementById('restart').addEventListener('click', function() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('consent-section').style.display = 'block';
});
