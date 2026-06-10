const QUIZ_URL = "https://ko-lay926.github.io/WeeklyEnglish2/quizzes.json";

let quizData = {};
let currentLevel = "level1";
let currentIndex = 0;
let score = 0;

async function loadQuiz() {
  try {
    const res = await fetch(QUIZ_URL);
    quizData = await res.json();

    showQuestion();
  } catch (err) {
    console.error("Error loading quiz:", err);
  }
}

function changeLevel(level) {
  currentLevel = level;
  currentIndex = 0;
  score = 0;
  document.getElementById("result").innerText = "";
  showQuestion();
}

function showQuestion() {
  const qData = quizData[currentLevel].questions[currentIndex];

  document.getElementById("question").innerText = qData.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  qData.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;

    btn.onclick = () => checkAnswer(i);

    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const qData = quizData[currentLevel].questions[currentIndex];

  if (selected === qData.answer) {
    score++;
    document.getElementById("result").innerText = "✅ Correct!";
  } else {
    document.getElementById("result").innerText = "❌ Wrong!";
  }

  currentIndex++;

  setTimeout(() => {
    if (currentIndex < quizData[currentLevel].questions.length) {
      showQuestion();
    } else {
      document.getElementById("question").innerText = "Level Completed 🎉";
      document.getElementById("options").innerHTML = "";
      document.getElementById("result").innerText =
        "Score: " + score + " / 10";
    }
  }, 800);
}

window.onload = loadQuiz;
