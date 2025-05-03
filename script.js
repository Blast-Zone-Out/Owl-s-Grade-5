let username = "";
let score = 0;
let timer;
let timeLeft = 60;
let currentQuestion = 0;
let userAnswers = [];
let isPaused = false;
let selectedQuestions = [];



const questions = [
    { number: 34, roundTo: 10, answer: 30 },       // Easy
    { number: 67, roundTo: 10, answer: 70 },       // Easy
    { number: 123, roundTo: 100, answer: 100 },    // Hard
    { number: 455, roundTo: 100, answer: 500 },    // Hard
    { number: 999, roundTo: 10, answer: 1000 },    // Hard
    { number: 12, roundTo: 10, answer: 10 },       // Easy
    { number: 48, roundTo: 10, answer: 50 },       // Easy
    { number: 85, roundTo: 10, answer: 90 },       // Easy
    { number: 321, roundTo: 100, answer: 300 },    // Hard
    { number: 764, roundTo: 100, answer: 800 },    // Hard
    { number: 5, roundTo: 10, answer: 10 },        // Easy
    { number: 19, roundTo: 10, answer: 20 },       // Easy
    { number: 142, roundTo: 100, answer: 100 },    // Hard
    { number: 876, roundTo: 100, answer: 900 },    // Hard
    { number: 29, roundTo: 10, answer: 30 },       // Easy
    { number: 51, roundTo: 10, answer: 50 },       // Easy
    { number: 604, roundTo: 100, answer: 600 },    // Hard
    { number: 388, roundTo: 100, answer: 400 },    // Hard
    { number: 73, roundTo: 10, answer: 70 },       // Easy
    { number: 999, roundTo: 100, answer: 1000 }    // Hard
  ]
  ;

  clearInterval(timer); // Just in case a previous timer was running

  function startGame() {
    username = document.getElementById("username").value;
    if (!username) return alert("Please enter your name.");
  
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
  
    score = 0;
    currentQuestion = 0;
    userAnswers = [];
  
    // Shuffle & take first 10
    questions.sort(() => Math.random() - 0.5);
    selectedQuestions = questions.slice(0, 10);
  
    startTimer();
    showQuestion();
  }
  

function playSound(id) {
    const sound = document.getElementById(id);
    if (!sound) return;
  
    // Pause tick if correct/wrong is playing
    if (id === "correctSound" || id === "wrongSound") {
      const tick = document.getElementById("tickSound");
      tick.pause();
  
      sound.currentTime = 0;
      sound.play().then(() => {
        sound.onended = () => {
          if (timeLeft > 0) tick.play();
        };
      }).catch((err) => {
        console.log("Sound play error:", err);
      });
    } else {
      sound.currentTime = 0;
      sound.play().catch(err => console.log("Tick play error:", err));
    }
  }
  
  

  function startTimer() {
    timeLeft = 60;
    document.getElementById("tickSound").loop = true;
    document.getElementById("tickSound").play();
  
    updateTimerBar();
    timer = setInterval(() => {
        if (!isPaused) {
          timeLeft--;
          document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
          updateTimerBar();
          if (timeLeft < 0) {
            clearInterval(timer);
            document.getElementById("tickSound").pause();
            document.getElementById("tickSound").currentTime = 0;
            endGame();
          }
        }
      }, 1000);
      
  }
  

  function updateTimerBar() {
    const percent = (timeLeft / 60) * 100;
    document.getElementById("timer-fill").style.width = `${percent}%`;
  }
  

function showQuestion() {
    const q = selectedQuestions[currentQuestion];

  document.getElementById("question").innerText = `Round ${q.number} to the nearest ${q.roundTo}`;
  document.getElementById("answer").value = "";
}

function submitAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const current = selectedQuestions[currentQuestion];
    userAnswers.push({
      question: `Round ${current.number} to the nearest ${current.roundTo}`,
      userAnswer: userAnswer,
      correctAnswer: current.answer
    });
  
    if (userAnswer === current.answer) {
      playSound("correctSound");
      score++;
      nextQuestion();
    } else {
      playSound("wrongSound");
      showTutorialPrompt(current);
    }
  }
  
  

  function showTutorialPrompt(question) {
    isPaused = true;
  
    const tick = document.getElementById("tickSound");
    tick.pause(); // ⏸ Pause ticking sound when tutorial prompt shows
  
    const backdrop = document.createElement("div");
    backdrop.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99998;
    `;
    backdrop.id = "tutorial-backdrop";
    document.body.appendChild(backdrop);
  
    const promptBox = document.createElement("div");
    promptBox.classList.add("tutorial-prompt");
    promptBox.innerHTML = `
      <p>❌ Incorrect! Need help? Would you like a tutorial?</p>
      <button id="yes-tutorial">✅ Step-by-Step Tutorial</button>
      <button id="no-tutorial">❌ No Thanks</button>
      <a href="https://www.youtube.com/watch?v=uedvwH6Ay18" target="_blank" style="display: block; margin-top: 10px; color: blue; text-decoration: underline;">📺 Watch a Video Tutorial</a>
    `;
    document.body.appendChild(promptBox);
  
    document.getElementById("yes-tutorial").onclick = () => {
      document.body.removeChild(promptBox);
      document.body.removeChild(backdrop);
      showTutorialSteps(question);
    };
  
    document.getElementById("no-tutorial").onclick = () => {
      document.body.removeChild(promptBox);
      document.body.removeChild(backdrop);
      isPaused = false;
      tick.play(); // ▶ Resume ticking
      nextQuestion();
    };
  }
  
  
  
  function showTutorialSteps(question) {
    const tutorialBox = document.createElement("div");
    tutorialBox.classList.add("tutorial-box");
  
    let place = question.roundTo === 10 ? "tens" : "hundreds";
  
    tutorialBox.innerHTML = `
      <h3>📘 Step-by-Step Tutorial</h3>
      <ol>
        <li>Look at the ${place} digit in ${question.number}.</li>
        <li>Check the digit to its right.</li>
        <li>If that digit is 5 or more, round up.</li>
        <li>If it's less than 5, round down.</li>
        <li>Correct Answer: <strong>${question.answer}</strong></li>
      </ol>
      <button id="continue-btn">Continue</button>
    `;
  
    document.body.appendChild(tutorialBox);
  
    document.getElementById("continue-btn").onclick = () => {
      document.body.removeChild(tutorialBox);
      isPaused = false;
      document.getElementById("tickSound").play(); // ▶ Resume ticking
      nextQuestion();
    };
  }
  
// document.getElementById("tutorial-prompt").classList.add("animate__animated", "animate__bounceIn");

function continueGame() {
    document.getElementById("tutorial-prompt").style.display = "none";
    document.getElementById("tutorial").style.display = "none";
    isPaused = false;
    nextQuestion();
  }
  

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= selectedQuestions.length) {

    endGame();
  } else {
    showQuestion();
  }
}

function endGame() {
    clearInterval(timer); // 🔁 Stop the timer
    document.getElementById("tickSound").pause();
    document.getElementById("tickSound").currentTime = 0;
  
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  
    let resultHTML = `<h3>Game Over!</h3><p>Score: ${score}/10</p><h4>Results:</h4><ul>`;
    userAnswers.forEach((entry, i) => {
      const color = entry.userAnswer === entry.correctAnswer ? 'green' : 'red';
      resultHTML += `<li>
        Q${i+1}: ${entry.question}<br>
        Your Answer: <span style="color:${color}">${entry.userAnswer}</span><br>
        Correct Answer: ${entry.correctAnswer}
      </li><br>`;
    });
    resultHTML += `</ul>`;
  
    // Add buttons
    resultHTML += `
  <button onclick="restartGame()">🔁 Play Again</button>
  <button onclick="window.location.href='leaderboard.html'">📊 View Leaderboard</button>
`;

  
    alert(`Time's up or you've completed all questions! Your score is ${score}/10`);
    saveToLeaderboard();
  
    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = resultHTML;
  }
  
  
  

function saveToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: username, score: score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const boardDiv = document.getElementById("leaderboard");
  boardDiv.innerHTML = "<h3>Leaderboard</h3>";
  leaderboard.forEach((entry, index) => {
    boardDiv.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.score}</p>`;
  });
}
function restartGame() {
    // Reset everything and restart the game
    clearInterval(timer);
    document.getElementById("tickSound").pause();
    document.getElementById("tickSound").currentTime = 0;
  
    document.getElementById("game").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("username").value = "";
    score = 0;
    currentQuestion = 0;
    userAnswers = [];
    isPaused = false;
    selectedQuestions = [];
  }
  
