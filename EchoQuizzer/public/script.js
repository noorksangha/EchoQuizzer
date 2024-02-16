document.addEventListener("DOMContentLoaded", function () {
    let questions = [];
    const questionZone = document.getElementById("question");
    const answerbuttons = document.getElementById('answerButtons');
    const next = document.getElementById('next');
    const micBtn = document.getElementById('mic');
    const playbackElement = document.querySelector(".playback");

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        fetchQuestions();
        micBtn.style.display = 'inline-block'; // Show the mic button at the start of the quiz
        playbackElement.style.display = 'none'; // Hide the playback element at the start of the quiz
    }

    async function fetchQuestions() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            const response = await fetch(`/get-questions?category=${encodeURIComponent(category)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            questions = await response.json(); // Update the questions array with fetched data
            showQuestion(); // Show the first question
        } catch (error) {
            console.error('Could not fetch questions: ', error);
        }
    }

    function showQuestion() {
        resetContent();
        let currentQuestion = questions[currentQuestionIndex];
        questionZone.innerHTML = currentQuestionIndex + 1 + ". " + currentQuestion.question;
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = answer.text;
            button.className = 'choice';
            answerbuttons.appendChild(button);
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click", selectAnswer);
        });
        micBtn.style.display = 'inline-block'; // Show the mic button for each question
        playbackElement.style.display = 'none'; // Hide the playback element for each question
    }

    function resetContent() {
        next.style.display = 'none';
        while (answerbuttons.firstChild) {
            answerbuttons.removeChild(answerbuttons.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectbtn = e.target;
        const iscorrect = selectbtn.dataset.correct === 'true';
        if (iscorrect) {
            selectbtn.classList.add('correct');
            score++;
        } else {
            selectbtn.classList.add('incorrect');
        }
        Array.from(answerbuttons.children).forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            }
            btn.disabled = true;
        });
        next.style.display = "block";
        micBtn.style.display = 'none'; // Hide the mic button when an answer is selected
        playbackElement.style.display = 'none'; // Hide the playback element when an answer is selected
    }

    function showScore() {
        resetContent();
        questionZone.style.textAlign = "center";
        questionZone.innerHTML = "You scored " + score + " out of " + questions.length + " !";
        next.innerHTML = "Play Again";
        next.style.display = "block";
        micBtn.style.display = 'none'; // Hide the mic button after the quiz is finished
        playbackElement.style.display = 'none'; // Hide the playback element after the quiz is finished
    }

    function handleNextBtn() {
        ++currentQuestionIndex;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    next.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length) {
            handleNextBtn();
        } else {
            startQuiz();
        }
    });

    startQuiz();

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
