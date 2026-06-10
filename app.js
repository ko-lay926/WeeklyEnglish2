let quizData = JSON.parse(localStorage.getItem("quizData")) || {};
let studentName = "";
let currentWeek="";
let qIndex=0;
let score=0;
let questions=[];

setTimeout(()=>{
document.getElementById("splash").style.display="none";
document.getElementById("app").classList.remove("hidden");
},1500);

async function updateQuizzes(){
try{
const url="https://YOUR_GITHUB.github.io/WeeklyEnglish/www/quizzes.json";
const res=await fetch(url,{cache:"no-store"});
const data=await res.json();

localStorage.setItem("quizBackup",JSON.stringify(quizData));
quizData=data;
localStorage.setItem("quizData",JSON.stringify(data));

alert("Updated!");
}catch(e){
alert("Offline mode");
}
}

function saveName(){
studentName=document.getElementById("studentName").value;
if(!studentName) return;
localStorage.setItem("studentName",studentName);
document.getElementById("name-screen").classList.add("hidden");
document.getElementById("main-menu").classList.remove("hidden");
}

function openWeekMenu(){
hide();
document.getElementById("week-menu").classList.remove("hidden");
let c=document.getElementById("weekButtons");
c.innerHTML="";
Object.keys(quizData).forEach(w=>{
let b=document.createElement("button");
b.innerText=w+(isUnlocked(w)?"":" 🔒");
b.onclick=()=>{if(isUnlocked(w)) startQuiz(w);};
c.appendChild(b);
});
}

function isUnlocked(w){
let u=JSON.parse(localStorage.getItem("unlocked"))||["week1"];
return u.includes(w);
}

function startQuiz(w){
currentWeek=w;
questions=quizData[w].questions;
qIndex=0;score=0;
hide();
document.getElementById("quiz-box").classList.remove("hidden");
showQ();
}

function showQ(){
let q=questions[qIndex];
document.getElementById("progress").innerText=(qIndex+1)+"/"+questions.length;
document.getElementById("question").innerText=q.q;
let o=document.getElementById("options");
o.innerHTML="";
q.options.forEach((x,i)=>{
let b=document.createElement("button");
b.innerText=x;
b.onclick=()=>{
if(i==q.answer) score++;
qIndex++;
if(qIndex<questions.length) showQ();
else finish();
};
o.appendChild(b);
});
}

function finish(){
hide();
document.getElementById("result").classList.remove("hidden");
document.getElementById("scoreText").innerText=score+"/"+questions.length;
save();
unlock();
}

function unlock(){
let u=JSON.parse(localStorage.getItem("unlocked"))||["week1"];
let weeks=Object.keys(quizData);
let i=weeks.indexOf(currentWeek);
if(score/questions.length>0.8){
if(weeks[i+1]) u.push(weeks[i+1]);
}
localStorage.setItem("unlocked",JSON.stringify(u));
}

function save(){
let r=JSON.parse(localStorage.getItem("results"))||[];
r.push({name:studentName,week:currentWeek,score,date:new Date().toLocaleString()});
localStorage.setItem("results",JSON.stringify(r));
}

function showResults(){
hide();
document.getElementById("history").classList.remove("hidden");
}

function showLeaderboard(){
hide();
document.getElementById("leaderboard").classList.remove("hidden");
let data=JSON.parse(localStorage.getItem("results"))||[];
let map={};
data.forEach(x=>{
map[x.name]=(map[x.name]||0)+x.score;
});
let board=document.getElementById("board");
board.innerHTML="";
Object.entries(map).sort((a,b)=>b[1]-a[1]).forEach(([n,s])=>{
let d=document.createElement("div");
d.innerText=n+" - "+s;
board.appendChild(d);
});
}

function hide(){
["main-menu","week-menu","quiz-box","result","history","leaderboard"]
.forEach(i=>document.getElementById(i).classList.add("hidden"));
}

function goHome(){
hide();
document.getElementById("main-menu").classList.remove("hidden");
}

window.onload=()=>{
let n=localStorage.getItem("studentName");
if(n){
studentName=n;
document.getElementById("name-screen").classList.add("hidden");
document.getElementById("main-menu").classList.remove("hidden");
}
};
