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
  async function stopRecording() {
    return new Promise((resolve) => {
      mediaRecorder.addEventListener("stop", () => {
        // Compile the audio blobs into a .wav format Blob
        lastRecordedBlob = new Blob(audioBlobs, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(lastRecordedBlob);
        playbackElement.src = audioUrl;
        resolve(lastRecordedBlob);

        // Reset the mic button appearance
        micBtn.classList.remove("is-recording");
      });

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }

  // Toggle recording on mic button click
  micBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  });
});
