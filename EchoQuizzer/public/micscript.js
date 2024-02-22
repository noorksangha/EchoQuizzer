document.addEventListener("DOMContentLoaded", function () {
  let mediaRecorder = null;
  let audioBlobs = [];
  let lastRecordedBlob = null;

  const micBtn = document.getElementById("mic");
  const playbackElement = document.querySelector(".playback");

  // Function to start recording audio
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioBlobs = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", (event) =>
        audioBlobs.push(event.data)
      );
      mediaRecorder.start();

      // Change the mic button appearance to indicate recording
      micBtn.classList.add("is-recording");
    } catch (error) {
      console.error("Error accessing audio devices.", error);
    }
  }

  // Function to stop recording and compile audio blobs
 // Function to stop recording and compile audio blobs
async function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.stream.getTracks().forEach((track) => track.stop());

  return new Promise((resolve) => {
    mediaRecorder.addEventListener("stop", () => {
      // Compile the audio blobs into a .wav format Blob
      lastRecordedBlob = new Blob(audioBlobs, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(lastRecordedBlob);
      playbackElement.src = audioUrl;

      // Download the .wav file
      downloadBlob(lastRecordedBlob, "recording.wav");

      // Reset the mic button appearance
      micBtn.classList.remove("is-recording");

      // Resolve the promise with the lastRecordedBlob after it's been sent to the server
      resolve(lastRecordedBlob);
    });
  });
}

// Function to download a blob as a file
function downloadBlob(blob, filename) {
  // Create an invisible a element
  const element = document.createElement("a");
  document.body.appendChild(element);
  element.style.display = 'none';

  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);
  element.href = url;
  element.download = filename;
  element.click();

  // Remove the a element after download
  document.body.removeChild(element);
  window.URL.revokeObjectURL(url); // Clean up the URL object
}


  // This function now separately awaits the stopping of the recording
  // and then uploads the audio blob to the server.
  async function handleRecordingStop() {
    const recordedBlob = await stopRecording();
    await uploadAudio(recordedBlob);
  }

  async function uploadAudio(blob) {
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav"); // or 'recording.wav' if converted to WAV

    try {
      const response = await fetch("/upload-audio", {
        method: "POST",
        body: formData,
      });
      // Handle response from the server
      console.log(await response.text());
    } catch (error) {
      console.error("Upload failed", error);
    }
  }

  // Toggle recording on mic button click
  micBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      // stopRecording();
      handleRecordingStop();
    } else {
      startRecording();
    }
  });
});
