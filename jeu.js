// Sélectionner élément canvas
const cvs = document.getElementById("casse-briques");
const ctx = cvs.getContext("2d");

// Ajouter bordure au canvas
cvs.style.border = "1px solid #0ff";

// Faire ligne épaisse quand canvas apparait
ctx.lineWidth = 3;

// Variables et constantes du jeu
const PADDLE_WIDTH = 80;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 7;
let LIFE = 6; // Le joueur a 3 vies
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 6;
let GAME_PAUSE = false;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;
let cancelMe = "";

// Créer la raquette
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 5
}

// Afficher la raquette
function drawPaddle() {
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Contrôler la raquette
cvs.addEventListener("touchcancel", touchCancel);
cvs.addEventListener("touchend", touchEnd);
cvs.addEventListener("touchmove", touchMove);
cvs.addEventListener("touchstart", touchStart);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(event) {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if(event.keyCode == 39) {
        rightArrow = true;
    }
}

function keyUpHandler(event) {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if(event.keyCode == 39) {
        rightArrow = false;
    }
}

function mouseMoveHandler(event) {
    var relativeX = event.clientX - cvs.offsetLeft;
    if(relativeX > 0 + 38 && relativeX < cvs.width - 38) {
        paddle.x = relativeX - 38;
    }
}

function touch(x) {
    if (!x) {
        movePaddle(Direction.STOP);
    } else if (x > paddle.x) {
        movePaddle(Direction.RIGHT);
    } else if (x < paddle.x) {
        movePaddle(Direction.LEFT);
    }
}

function touchCancel(event) {
    touch(null);
}

function touchEnd(event) {
    touch(null);
}

function touchMove(event) {
    touch(event.touches[0].clientX);
}

function touchStart(event) {
    touch(event.touches[0].clientX);
}

// Bouger raquette
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

// Créer la balle
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

// Afficher la balle
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

// Bouger la balle
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Détection collision balle et mur
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width - 1 || ball.x + ball.radius < 18 ) {
        ball.dx = - ball.dx;
        WALL_HIT.play();
    }

    if (ball.y + ball.radius < 18) {
        ball.dy = - ball.dy;
        WALL_HIT.play();
    }

    if (ball.y + ball.radius > cvs.height) {
        LIFE--; // Perte vie
        LIFE_LOST.play();
        resetBall();
    }
}

// Réinitialisation balle
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// Collision balle et raquette
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {

        // Jouer le son
        PADDLE_HIT.play();

        // Valider où la balle touche la raquette
        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        // Normaliser les valeurs
        collidePoint = collidePoint / (paddle.width/2);

        // Calculer l'angle de la balle
        let angle = collidePoint * Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// Créer les briques
const brick = {
    row : 2,
    column : 5,
    width : 45,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#2e3548",
    strokeColor : "#FFF"
}

let bricks = [];

function createBricks(){
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x : c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y : r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// Afficher les briques
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];

            // Si la brique n'est pas cassée
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// Collision balle et brique
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];

            // Si la brique n'est pas cassée
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // La brique est cassée
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// Montrer les stats du jeu
function showGameStats(text, textX, textY, img, imgX, imgY) {
    
    // Afficher texte
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);

    // Afficher image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// Fonction afficher
function draw() {
    drawPaddle();

    drawBall();

    drawBricks();

    // Montrer score
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);

    // Montrer vies
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);

    // Montrer niveau
    showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}

// Game over
function gameOver() {
    if (LIFE <= 0) {
        showYouLose();
        GAME_OVER = true;
    }
}

// Niveau supérieur
function levelUp() {
    let isLevelDone = true;

    // Vérifier si les briques sont cassées
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }

    if (isLevelDone) {
        WIN.play();

        if (LEVEL >= MAX_LEVEL) {
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.8;
        resetBall();
        LEVEL++;
    }
}

// Fonction mise à jour du jeu
function update() {
    movePaddle();

    moveBall();

    ballWallCollision();

    ballPaddleCollision();

    ballBrickCollision();

    gameOver();

    levelUp();
}

// Boucle du jeu
function loop(){

    // Vider le canvas
    ctx.drawImage(BG_IMG, 0, 0);
    if (LEVEL > 3) {
        ctx.drawImage(BG1_IMG, 0, 0);
    }

    draw();

    update();

    if (! GAME_OVER) {
        cancelMe = requestAnimationFrame(loop);
    }
}

loop();

// Sélectionner bouton son
const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager() {
    
    // Changer l'image SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

    soundElement.setAttribute("src", SOUND_IMG);

    // Couper et remettre le son
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// Sélectionner bouton pause
const pause = document.getElementById("pause");

pause.addEventListener("click", startAnimation, false);

function startAnimation(event) {
    if(this.textContent === "Start"){
        requestAnimationFrame(loop);
        this.textContent = 'Pause';
    } else{
        cancelAnimationFrame(cancelMe);
        this.textContent = 'Start';
    }
}

// Montrer le message Game Over
/* Sélectionner éléments */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// Cliquer sur le bouton rejouer
restart.addEventListener("click", function() {
    location.reload(); // Recharger la page
})

// Montrer que tu as gagné
function showYouWin() {
    gameover.style.display = "block";
    youwin.style.display = "block";
}

// Montrer que tu as perdu
function showYouLose() {
    gameover.style.display = "block";
    youlose.style.display = "block";
}
