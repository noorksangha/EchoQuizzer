//script.js
let questions = [];
const questionZone=document.getElementById("question");
const answerbuttons=document.getElementById('answerButtons');
const next=document.getElementById('next');


let currentQuestionIndex=0;
let score=0;
function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    fetchQuestions();
}
document.getElementById('runPythonScript').addEventListener('click', function() {
    fetch('/run-script', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('Script executed: ' + data.message);

        handleNextBtn();

      })
      .catch(error => console.error('Error:', error));
  });

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

function showQuestion(){
    resetContent()
    let currentQuestion=questions[currentQuestionIndex];
    questionZone.innerHTML=currentQuestionIndex+1 + ". "+ currentQuestion.question;
    currentQuestion.answers.forEach(answer =>{
        const button=document.createElement('button');
        button.innerHTML=answer.text;
        button.className='choice';
        answerbuttons.appendChild(button);
        if(answer.correct){
            button.dataset.correct=answer.correct;
        }
        button.addEventListener("click",selectAnswer);
    })
}
function resetContent(){
    next.style.display='none'
    while(answerbuttons.firstChild){
        answerbuttons.removeChild(answerbuttons.firstChild)
    }
}
function selectAnswer(e){
    const selectbtn=e.target;
    const iscorrect=selectbtn.dataset.correct==='true';
    if(iscorrect){
        selectbtn.classList.add('correct');
        score++
    }else{
        selectbtn.classList.add('incorrect')
    }
    Array.from(answerbuttons.children).forEach(btn =>{
        if(btn.dataset.correct==='true'){
            btn.classList.add('correct');
        }
        btn.disabled=true;
    });
    next.style.display="block"
}

function showScore() {
    resetContent();
    
    // Hide the buttons and audio controls
    document.getElementById('runPythonScript').style.display = 'none';
    document.getElementById('mic').style.display = 'none';
    document.querySelector('.playback').style.display = 'none';

    // Set the question zone to display the score
    questionZone.style.textAlign = "center";
    questionZone.innerHTML = "Speaker 1 scored " + 2 + " out of " + questions.length + "! " + "Speaker 2 scored " +(score) + " out of " + questions.length + "! ";

    
    // Update the next button to indicate playing again and show it
    next.innerHTML = "Play Again";
    next.style.display = "block";
}

function handleNextBtn(){
    currentQuestionIndex++
    if(currentQuestionIndex<questions.length){
        showQuestion()
    }else{
        showScore()
    }
}
next.addEventListener('click',()=>{
    if(currentQuestionIndex<questions.length){
        handleNextBtn()
    }else{
        startQuiz()
    }
})
startQuiz()
