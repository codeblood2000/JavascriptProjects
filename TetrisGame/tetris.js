const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE";

//draw square
const drawSquare = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

//create board
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = []
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

//draw board
const drawBoard = () => {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

const PIECES = [
    [I, "red"],
    [J, "yellow"],
    [L, "blue"],
    [O, "green"],
    [S, "black"],
    [T, "orange"],
    [Z, "violet"]
]

function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length)// return random 0 -> 6
    return new Piece(PIECES[r][0], PIECES[r][1])
}

//Object Piece
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = 0;
}

let p = randomPiece();
let score = 0;

Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c])
                drawSquare(this.x + c, this.y + r, color);
        }
    }
}

Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}

//move piece down
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}

//move piece right
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

//move piece left
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

//rotate the piece
Piece.prototype.rotate = function () {
    this.nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, this.nextPattern)) {
        if (this.x > COL / 2) {
            //it's right wall 
            kick = -1;//kick the piece to left
        } else {
            //it's left wall 
            kick = +1;//kick the piece to right
        }
    }
    if (!this.collision(kick, 0, this.activeTetromino)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

//find of there is a collision
Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            //if square is empty we skip
            if (!piece[r][c]) {
                continue;
            }
            //co-ordinates of piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            //skip newY < 0; board[-1] will crash the game
            if (newY < 0) {
                continue;
            }
            // check is there is already a locked piece
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            //we skip vacant square
            if (!this.activeTetromino[r][c]) {
                continue;
            }

            // when we reach the top
            console.log(this.y, r);
            if (this.y + c <= 0) {
                console.log("game over")
                alert("GAME OVER");
                gameOver = true;
                break;
            }
            //we lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }

    //remove full row
    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT)
        }
        if (isRowFull){
            for(y=r; y>1;y--){
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y-1][c];
                }
            }
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            score += 10
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;
}

p.draw();



const CONTROL = (e) => {
    if (e.keyCode == 37) {
        p.moveLeft();
    } else if (e.keyCode == 38) {
        p.rotate();
    } else if (e.keyCode == 39) {
        p.moveRight();
    } else if (e.keyCode == 40) {
        p.moveDown();
    }
}
document.addEventListener("keydown", CONTROL);


//drop piece in 1s

let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
        console.log("genetaing")
    }
}

drop();

