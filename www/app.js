let studentName = "";
let currentWeek = "";
let currentQuestion = 0;
let score = 0;
let questions = [];
let quizData =
JSON.parse(localStorage.getItem("quizData")) || null;

if(!quizData){
quizData = {

week1:{
questions:[

{
q:"She ___ my friend.",
options:["is","are","am"],
answer:0
},

{
q:"I ___ a student.",
options:["am","is","are"],
answer:0
},

{
q:"They ___ happy.",
options:["am","is","are"],
answer:2
},

{
q:"Choose the plural form of 'cat'.",
options:["cats","cates","cat"],
answer:0
},

{
q:"___ is my brother.",
options:["He","She","They"],
answer:0
},

{
q:"I saw ___ apple.",
options:["a","an","the"],
answer:1
},

{
q:"We ___ football every day.",
options:["play","plays","playing"],
answer:0
},

{
q:"Choose the correct noun.",
options:["Book","Run","Fast"],
answer:0
},

{
q:"How ___ books do you have?",
options:["many","much","little"],
answer:0
},

{
q:"She ___ to school every day.",
options:["go","goes","going"],
answer:1
}

]
},

week2:{
questions:[

{
q:"He ___ TV every evening.",
options:["watch","watches","watching"],
answer:1
},

{
q:"Choose the plural form of 'baby'.",
options:["babys","babies","babyes"],
answer:1
},

{
q:"This is my dog. ___ is friendly.",
options:["It","They","She"],
answer:0
},

{
q:"There is ___ elephant at the zoo.",
options:["a","an","the"],
answer:1
},

{
q:"How ___ milk do you need?",
options:["many","much","few"],
answer:1
},

{
q:"They ___ to school by bus.",
options:["go","goes","going"],
answer:0
},

{
q:"Choose the proper noun.",
options:["Yangon","city","river"],
answer:0
},

{
q:"I ___ my homework yesterday.",
options:["do","did","will do"],
answer:1
},

{
q:"The birds ___ in the sky.",
options:["fly","flies","flying"],
answer:0
},

{
q:"Choose the plural noun.",
options:["chair","chairs","table"],
answer:1
}

]
},

week3:{
questions:[

{
q:"She ___ dinner now.",
options:["cook","cooks","is cooking"],
answer:2
},

{
q:"Choose the plural form of 'box'.",
options:["boxs","boxes","boxies"],
answer:1
},

{
q:"My parents ___ very kind.",
options:["is","are","am"],
answer:1
},

{
q:"I drank ___ orange juice.",
options:["a","an","the"],
answer:2
},

{
q:"How ___ chairs are there?",
options:["many","much","little"],
answer:0
},

{
q:"They ___ a movie last night.",
options:["watch","watched","watching"],
answer:1
},

{
q:"Choose the common noun.",
options:["school","Mandalay","Monday"],
answer:0
},

{
q:"He ___ his teeth every morning.",
options:["brush","brushes","brushing"],
answer:1
},

{
q:"___ are my friends.",
options:["He","She","They"],
answer:2
},

{
q:"The baby ___ loudly.",
options:["cry","cries","crying"],
answer:1
}

]
}

};
}
async function updateQuizzes(){
  try{

    const QUIZ_URL = "https://ko-lay926.github.io/WeeklyEnglish2/www/quizzes.json";

    const response = await fetch(QUIZ_URL, { cache: "no-store" });
    
    if(!response.ok){
      throw new Error("Network error");
    }

    const data = await response.json();

    if(!data.week1){
      alert("Invalid quiz file!");
      return;
    }

    // backup old data
    localStorage.setItem(
      "quizBackup",
      localStorage.getItem("quizData")
    );

    // save quiz data
    quizData = data;

    localStorage.setItem(
      "quizData",
      JSON.stringify(data)
    );

    // NEW WEEKS LOGIC
    let newWeeks = [];

    const weeks = Object.keys(data);
    const latestWeek = weeks[weeks.length - 1];

    newWeeks.push(latestWeek);

    localStorage.setItem(
      "newWeeks",
      JSON.stringify(newWeeks)
    );

    // WEEK DATE MAP
    let weekDates =
      JSON.parse(localStorage.getItem("weekDates")) || {};

    const today = new Date().toLocaleDateString();

    Object.keys(data).forEach(week=>{
      weekDates[week] = today;
    });

    localStorage.setItem(
      "weekDates",
      JSON.stringify(weekDates)
    );

    alert("Weekly quizzes updated successfully!");

  }catch(error){

    alert("Update failed. Using offline data.");

    const backup = localStorage.getItem("quizBackup");

    if(backup){
      quizData = JSON.parse(backup);
    }
  }
}
function saveName(){

studentName =
document.getElementById("studentName").value;

if(studentName.trim() === ""){

alert("Please enter your name");

return;

}

document.getElementById("name-screen")
.classList.add("hidden");

document.getElementById("main-menu")
.classList.remove("hidden");

localStorage.setItem(
"studentName",
studentName
);

}

function createWeekButtons(){

const container =
document.getElementById("weekButtons");

container.innerHTML = "";

const weekDates =
JSON.parse(localStorage.getItem("weekDates")) || {};

let newWeeks =
JSON.parse(localStorage.getItem("newWeeks")) || [];

Object.keys(quizData).forEach((week)=>{

const btn = document.createElement("button");

const date = weekDates[week] || "Not updated";

let text = week.toUpperCase() + " - " + date;

// ⭐ ONLY SHOW NEW FOR LATEST WEEK
if(newWeeks.includes(week)){
text += " 🔥 NEW";
}

btn.innerText = text;

btn.onclick = ()=>{

// remove NEW when opened
newWeeks = newWeeks.filter(w => w !== week);

localStorage.setItem(
"newWeeks",
JSON.stringify(newWeeks)
);

openWeek(week);
};

container.appendChild(btn);

});

}

function openWeekMenu(){

hideAll();

createWeekButtons();

document.getElementById("week-menu")
.classList.remove("hidden");

}

function isWeekUnlocked(week){

const unlocked =
JSON.parse(localStorage.getItem("unlockedWeeks"))
|| ["week1"];

return unlocked.includes(week);

}

function openWeek(week){

if(isWeekUnlocked(week)){

startQuiz(week);

}else{

alert("Complete previous week first.");

}

}

function exportResults(){

const history =
JSON.parse(localStorage.getItem("results"))
|| [];

let text =
"English Grammar Quiz Results\n\n";

history.forEach(item=>{

text +=
"Name: " + item.name + "\n" +
"Week: " + getWeekName(item.week) + "\n"+
"Score: " + item.score + "/" + item.total + "\n" +
"Date: " + item.date + "\n\n";

});

alert(text);

}

function goHome(){

hideAll();

document.getElementById("main-menu")
.classList.remove("hidden");

}

function hideAll(){

document.getElementById("main-menu")
.classList.add("hidden");

document.getElementById("week-menu")
.classList.add("hidden");

document.getElementById("quiz-box")
.classList.add("hidden");

document.getElementById("result")
.classList.add("hidden");

document.getElementById("history")
.classList.add("hidden");

document.getElementById("about")
.classList.add("hidden");

}

function startQuiz(week){

currentWeek = week;

questions = quizData[week].questions;

currentQuestion = 0;
score = 0;

hideAll();

document.getElementById("quiz-box")
.classList.remove("hidden");

showQuestion();

}

function showQuestion(){

const q = questions[currentQuestion];

document.getElementById("progress")
.innerText =
"Question " +
(currentQuestion + 1) +
" / " +
questions.length;

document.getElementById("question")
.innerText =
(currentQuestion + 1) + ". " + q.q;

const optionsDiv =
document.getElementById("options");

optionsDiv.innerHTML = "";

q.options.forEach((option,index)=>{

const btn = document.createElement("button");

btn.innerText = option;

btn.onclick = ()=>{

if(index === q.answer){
score++;
}

currentQuestion++;

if(currentQuestion < questions.length){
showQuestion();
}else{
showResult();
}

};

optionsDiv.appendChild(btn);

});

}

function showResult(){

hideAll();

document.getElementById("result")
.classList.remove("hidden");

document.getElementById("scoreText")
.innerText =
"Your Score: " + score + " / " + questions.length;
unlockNextWeek();
saveResult();

}

function unlockNextWeek(){

let unlocked =
JSON.parse(
localStorage.getItem("unlockedWeeks")
) || ["week1"];

const percent =
(score / questions.length) * 100;

if(percent < 99) return;

const weeks =
Object.keys(quizData);

const currentIndex =
weeks.indexOf(currentWeek);

const nextWeek =
weeks[currentIndex + 1];

if(nextWeek &&
!unlocked.includes(nextWeek)){

unlocked.push(nextWeek);

}

localStorage.setItem(
"unlockedWeeks",
JSON.stringify(unlocked)
);

}

function saveResult(){

let history =
JSON.parse(localStorage.getItem("results")) || [];

history.push({

name:studentName,

week:currentWeek,

score:score,

total:questions.length,

date:new Date().toLocaleString()

});

localStorage.setItem(
"results",
JSON.stringify(history)
);

}

function getWeekName(week){

return week.replace(
"week",
"Week "
);

}

function showResults(){

hideAll();

document.getElementById("history")
.classList.remove("hidden");

const history =
JSON.parse(localStorage.getItem("results")) || [];

const historyList =
document.getElementById("historyList");

historyList.innerHTML = "";

history.forEach(item=>{

const div = document.createElement("div");

div.innerHTML = `
<p>
 ${item.name}<br>
 ${getWeekName(item.week)}<br>
 Score: ${item.score}/${item.total}<br>
 ${item.date}
</p>

<hr>

`;

historyList.appendChild(div);

});

}

window.onload = function(){

const savedName =
localStorage.getItem("studentName");

if(savedName){

studentName = savedName;

document.getElementById("name-screen")
.classList.add("hidden");

document.getElementById("main-menu")
.classList.remove("hidden");

}

}
