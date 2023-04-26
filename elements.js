// Charger l'image de fond des 3 premiers niveaux
const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

// Charger l'image de fond des 2 derniers niveaux
const BG1_IMG = new Image();
BG1_IMG.src = "img/bg1.jpg";

// Charger l'image niveau
const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

// Charger l'image vie
const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

// Charger l'image score
const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

// Charger le son collision mur
const WALL_HIT = new Audio();
WALL_HIT.src = "sons/wall.mp3";

// Charger le son perte vie
const LIFE_LOST = new Audio();
LIFE_LOST.src = "sons/life_lost.mp3";

// Charger le son collision raquette
const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sons/paddle_hit.mp3";

// Charger le son victoire
const WIN = new Audio();
WIN.src = "sons/win.mp3";

// Charger le son collision brique
const BRICK_HIT = new Audio();
BRICK_HIT.src = "sons/brick_hit.mp3";