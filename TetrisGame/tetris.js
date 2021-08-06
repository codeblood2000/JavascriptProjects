const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE";

//draw square
const drawSquare = (x,y,color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

//create board
let board =[];
for(r=0; r < ROW; r++){
    board[r] = []
    for(c=0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

//draw board
const drawBoard = () => {
    for(r=0; r < ROW; r++){
        for(c=0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

const PIECES = [
    [I,"red"],
    [J,"yellow"],
    [L,"blue"],
    [O,"green"],
    [S,"black"],
    [T,"orange"],
    [Z,"violet"]
]

//Object Piece
function Piece (tetromino,color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x=0;
    this.y=0;
}

Piece.prototype.draw = function(){
    for(r=0; r < this.activeTetromino.length; r++){
        for(c=0; c < this.activeTetromino.length; c++){
            if(this.activeTetromino[r][c])
                drawSquare(this.x+c,this.x+r,this.color);
        }
    }   
}

//console.log(PIECES[0][0]);

const p = new Piece(PIECES[4][0], PIECES[3][1])
p.draw();
