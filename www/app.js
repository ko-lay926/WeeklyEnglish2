let studentName = "";
let currentWeek = "";
let currentQuestion = 0;
let score = 0;
let questions = [];

let quizData = JSON.parse(localStorage.getItem("quizData")) || null;

if(!quizData){
quizData = {
week1:{questions:[]}
};
}

async function updateQuizzes(){
  try{
    const QUIZ_URL = "https://YOUR_GITHUB_USERNAME.github.io/WeeklyEnglish/www/quizzes.json";

    const response = await fetch(QUIZ_URL, {cache:"no-store"});

    if(!response.ok) throw new Error("Network error");

    const data = await response.json();

    if(!data.week1){
      alert("Invalid quiz file!");
      return;
    }

    localStorage.setItem("quizBackup", localStorage.getItem("quizData"));

    quizData = data;

    localStorage.setItem("quizData", JSON.stringify(data));

    let newWeeks = [];
    const weeks = Object.keys(data);
    newWeeks.push(weeks[weeks.length - 1]);

    localStorage.setItem("newWeeks", JSON.stringify(newWeeks));

    let weekDates = JSON.parse(localStorage.getItem("weekDates")) || {};
    const today = new Date().toLocaleDateString();

    Object.keys(data).forEach(w=>{
      weekDates[w] = today;
    });

    localStorage.setItem("weekDates", JSON.stringify(weekDates));

    alert("Updated successfully!");

  }catch(e){
    alert("Offline mode activated");

    const backup = localStorage.getItem("quizBackup");
    if(backup) quizData = JSON.parse(backup);
  }
}

function saveName(){
studentName = document.getElementById("studentName").value;
if(studentName.trim()=="") return alert("Enter name");
localStorage.setItem("studentName",studentName);
document.getElementById("name-screen").classList.add("hidden");
document.getElementById("main-menu").classList.remove("hidden");
}

function hideAll(){
["main-menu","week-menu","quiz-box","result","history","about"]
.forEach(id=>document.getElementById(id).classList.add("hidden"));
}

function openWeekMenu(){
hideAll();
document.getElementById("week-menu").classList.remove("hidden");

const container = document.getElementById("weekButtons");
container.innerHTML="";

Object.keys(quizData).forEach(w=>{
const btn=document.createElement("button");
btn.innerText=w;
btn.onclick=()=>startQuiz(w);
container.appendChild(btn);
});
}

function startQuiz(week){
currentWeek=week;
questions=quizData[week].questions;
currentQuestion=0;
score=0;
hideAll();
document.getElementById("quiz-box").classList.remove("hidden");
showQuestion();
}

function showQuestion(){
const q=questions[currentQuestion];
document.getElementById("progress").innerText=`${currentQuestion+1}/${questions.length}`;
document.getElementById("question").innerText=q.q;

const opt=document.getElementById("options");
opt.innerHTML="";

q.options.forEach((o,i)=>{
const b=document.createElement("button");
b.innerText=o;
b.onclick=()=>{
if(i===q.answer) score++;
currentQuestion++;
if(currentQuestion<questions.length) showQuestion();
else showResult();
};
opt.appendChild(b);
});
}

function showResult(){
hideAll();
document.getElementById("result").classList.remove("hidden");
document.getElementById("scoreText").innerText=`${score}/${questions.length}`;
}

function goHome(){
hideAll();
document.getElementById("main-menu").classList.remove("hidden");
}

function showResults(){
hideAll();
document.getElementById("history").classList.remove("hidden");
}

function showAbout(){
hideAll();
document.getElementById("about").classList.remove("hidden");
}

function exportResults(){
alert("Export feature ready");
}

window.onload=()=>{
const n=localStorage.getItem("studentName");
if(n){
studentName=n;
document.getElementById("name-screen").classList.add("hidden");
document.getElementById("main-menu").classList.remove("hidden");
}
};
