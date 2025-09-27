const playerElement = document.querySelector('.player');
const obstacleElement = document.querySelector('.obstacle');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');
const restartGameElement = document.querySelector('.restart-game');
const gameContainerElement = document.querySelector('.game-container');
const bgMusic = document.getElementById("bg-music");

const OBSTACLE_SIZES = ['xs','s','m','l'];
let jumping = false;
let score = 0;
let scoreInterval, collisionInterval, changeObstacleInterval;
let highscore = localStorage.getItem('highscore') || 0;

/* -------------------- MUSIC -------------------- */
function startMusic() {
    if(localStorage.getItem("playMusic") === "true" && bgMusic) {
        bgMusic.play().catch(() => console.log("Autoplay blocked"));
        localStorage.removeItem("playMusic"); // Only trigger once
    }
}

function stopMusic() {
    if(bgMusic){
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

/* -------------------- JUMP -------------------- */
function addJumpListener() {
    document.addEventListener('keydown', event => {
        if(event.key === ' ' || event.key === 'ArrowUp') {
            jump();
        }
    })
}

function jump() {
    if(jumping) return;
    jumping = true;
    playerElement.classList.add('jump');
    setTimeout(() => {
        playerElement.classList.remove('jump');
        jumping = false;
    }, 1200);
}

/* -------------------- COLLISION -------------------- */
const LEFT_BUFFER = 50;
function monitorCollision() {
    collisionInterval = setInterval(() => {
        if(isCollision()) {
            checkForHighScore();
            stopGame();
            stopMusic();
        }
    }, 10);
}

function isCollision() {
    const playerRect = playerElement.getBoundingClientRect();
    const obstacleRect = obstacleElement.getBoundingClientRect();
    const xCollision = (obstacleRect.right - LEFT_BUFFER) > playerRect.left && obstacleRect.left < playerRect.right;
    const yCollision = playerRect.bottom > obstacleRect.top;
    return xCollision && yCollision;
}

/* -------------------- SCORE -------------------- */
function setScore(newScore) {
    scoreElement.innerHTML = score = newScore;
}

function countScore() {
    scoreInterval = setInterval(() => {
        setScore(score + 1);
    }, 100);
}

function setHighScore(newScore) {
    highScoreElement.innerText = highscore = newScore;
    localStorage.setItem('highscore', newScore);
}

function checkForHighScore() {
    if(score > highscore) setHighScore(score);
}

/* -------------------- OBSTACLES -------------------- */
function getRandomObstacleSize() {
    const index = Math.floor(Math.random() * (OBSTACLE_SIZES.length - 1));
    return OBSTACLE_SIZES[index];
}

function randomiseObstacle() {
    changeObstacleInterval = setInterval(() => {
        const obstacleSize = getRandomObstacleSize();
        obstacleElement.className = `obstacle obstacle-${obstacleSize}`;
    }, 3000);
}

/* -------------------- STOP / RESTART GAME -------------------- */
function stopGame() {
    clearInterval(collisionInterval);
    clearInterval(scoreInterval);
    clearInterval(changeObstacleInterval);
    restartGameElement.classList.add('show');
    gameContainerElement.classList.add('stop');
}

function restart() {
    location.reload();
    window.location.href = "index.html";
}

/* -------------------- MAIN -------------------- */
function main() {
    startMusic();
    addJumpListener();
    monitorCollision();
    countScore();
    setHighScore(highscore);
    randomiseObstacle();
}

main();
