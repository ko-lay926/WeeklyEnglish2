const QUIZ_URL =
"https://ko-lay926.github.io/WeeklyEnglish2/www/quizzes.json";

let quizData = {};
let currentLevel = "level1";
let currentIndex = 0;
let score = 0;

let username = localStorage.getItem("username");

if(!username){
    username = prompt("Enter your name");
    localStorage.setItem("username", username);
}

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("welcome").innerText =
    "Welcome, " + username + " 👋";

    loadQuiz();
});

async function loadQuiz(){

    try{

        const response = await fetch(QUIZ_URL);
        quizData = await response.json();

        showQuestion();

    }catch(error){

        document.getElementById("question").innerText =
        "Failed to load quiz.";

        console.error(error);
    }
}

function changeLevel(level){

    const num = parseInt(level.replace("level",""));

    if(num > 1){

        const prev = "level" + (num - 1);

        if(localStorage.getItem(prev + "_passed") !== "true"){

            alert(
            "Complete " +
            prev +
            " with 100% score first."
            );

            return;
        }
    }

    currentLevel = level;
    currentIndex = 0;
    score = 0;

    document.getElementById("result").innerText = "";

    showQuestion();
}

function showQuestion(){

    const q =
    quizData[currentLevel].questions[currentIndex];

    document.getElementById("question").innerText =
    q.q;

    const optionsDiv =
    document.getElementById("options");

    optionsDiv.innerHTML = "";

    q.options.forEach((option,index)=>{

        const btn =
        document.createElement("button");

        btn.className = "option";

        btn.innerText = option;

        btn.onclick = ()=>checkAnswer(index);

        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected){

    const q =
    quizData[currentLevel].questions[currentIndex];

    if(selected === q.answer){

        score++;

        document.getElementById("result").innerText =
        "✅ Correct";

    }else{

        document.getElementById("result").innerText =
        "❌ Wrong";
    }

    currentIndex++;

    setTimeout(()=>{

        if(
        currentIndex <
        quizData[currentLevel].questions.length
        ){

            showQuestion();

        }else{

            finishLevel();
        }

    },600);
}

function finishLevel(){

    const total =
    quizData[currentLevel].questions.length;

    document.getElementById("options").innerHTML = "";

    document.getElementById("question").innerText =
    "Level Finished 🎉";

    document.getElementById("result").innerText =
    "Score: " + score + " / " + total;

    if(score === total){

        localStorage.setItem(
        currentLevel + "_passed",
        "true"
        );

        document.getElementById("result").innerText +=
        "\n🏆 Perfect! Next level unlocked.";
    }
                      }
