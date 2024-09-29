// JavaScript (script.js)

document.getElementById('consent-allow').addEventListener('click', function() {
    document.getElementById('consent-section').style.display = 'none';
    document.getElementById('video-section').style.display = 'block';
    startVideo();
});

document.getElementById('consent-deny').addEventListener('click', function() {
    alert('You denied the consent. The system will not record your video.');
});

document.getElementById('stop-recording').addEventListener('click', function() {
    stopVideo();
    document.getElementById('video-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    analyzeEmotion();  // Placeholder for Gemini AI API call
});

function startVideo() {
    const videoElement = document.getElementById('video');
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoElement.srcObject = stream;
            })
            .catch(function(err) {
                console.log("Error: " + err);
            });
    }
}

function stopVideo() {
    const videoElement = document.getElementById('video');
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
}

function analyzeEmotion() {
    // Placeholder for the Gemini AI API
    const resultDiv = document.getElementById('emotion-result');
    resultDiv.innerHTML = "Gemini AI detected the following emotion: <strong>Happy</strong>";
}
