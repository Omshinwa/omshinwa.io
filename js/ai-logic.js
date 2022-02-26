"use strict";

let maxX = 7;
let maxY = 7;
var positionCount = 0;
var positionCount2 = 0;
var positionCount3 = 0;
var previousQuiesMoves = [];
var previousQuiesMoves2 = [];

//please delete these after debugging
function bite() {
  return game.moves({ verbose: true });
} //return quickly all moves
function ascii() {
  print(game.ascii());
}
function currentHash() {
  return ai.currentHash;
}
function hashBoard() {
  return ai.zobrist.hashBoard();
}
function reversemove(move) {
  let x = move.from;
  move.from = move.to;
  move.to = x;
  return move;
}
function reload() {
  board.position(game.fen());
  ai.currentHash = ai.zobrist.hashBoard();
}

function d2b(dec) {
  return (dec >>> 0).toString(2);
}

function print(e, type) {
  let css,
    size = 0;
  switch (type) {
    case 1:
      css = "background-color:#fee;";
      size = "5";
      break;
    case 2:
      css = "background-color:#fcc; font-weight:bold";
      break;
    case 3:
      css = "background-color:#faa; font-weight:bold";

      break;
    default:
      css = "background-color:#fff";
  }
  // console.trace();
  console.log("%c" + e, css);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function autoPlay(){

  while (game.game_over() == false){
    makeRandomMove()
    await sleep(300);
  }
  alert("Game over");
}

function makeRandomMove() {

  if (game.game_over()) {
    alert("Game over");
    return;
  }

  var move = getBestMove(game);

  // highlight
  if (move.color === "w") {
    $board.find("." + squareClass).removeClass("highlight-white");
    $board.find(".square-" + move.from).addClass("highlight-white");
    squareToHighlight = move.to;
    // squareToHighlight = move.from;
    colorToHighlight = "white";
  } else {
    $board.find("." + squareClass).removeClass("highlight-black");
    $board.find(".square-" + move.from).addClass("highlight-black");
    squareToHighlight = move.to;
    // squareToHighlight = move.from;
    colorToHighlight = "black";
  }

  ai.move(move);

  // update the board to the new position
  board.position(game.fen());

  if (game.game_over()) {
    window.setTimeout( function(){alert("Game over")}, 250);
  }
  
}

class TT_node {
  constructor({
    move = null,
    key = null,
    score = null,
    depth = null,
    nodeType = "UNKNOWN",
  }) {
    this.move = move;
    // this.fen = game.fen();
    // game.undo()
    this.score = score;
    this.depth = depth;
    this.key = key;
    this.nodeType = nodeType; // three types: exact, alpha or beta
  }
}

class Ai_Chess {
  constructor(game, depth) {
    this.transpositionTable = new Array(524287).fill(null); // {  {fen: FEN,score, depth}, }
    this.PVmoves = new Array(depth).fill(null); // PVmoves are the best moves
    this.lastTurnBestMove = []; // max 10
    this.lastQuiesMoves = [];
    this.zobrist = new Zobrist();
    this.currentHash = this.zobrist.hashBoard();
  }

  storeTranspositionTable(ttEntry) {
    let oldHash = this.transpositionTable[(ttEntry.key + 2147483648) % 524287];

    if (oldHash === null) {
      this.transpositionTable[(ttEntry.key + 2147483648) % 524287] = ttEntry;
    } else if (ttEntry.depth > oldHash.depth) {
      console.log("replaced " + oldHash.key + " with " + ttEntry.key);
      this.transpositionTable[(ttEntry.key + 2147483648) % 524287] = ttEntry;
    } else if (
      ttEntry.depth == oldHash.depth &&
      ttEntry.nodeType === "EXACT" &&
      oldHash.nodeType != "EXACT"
    ) {
      console.log("replaced2 " + oldHash.key + " with " + ttEntry.key);
      this.transpositionTable[(ttEntry.key + 2147483648) % 524287] = ttEntry;
    }
  }

  lookupTable(key) {
    //return the moveObj corresponding to the current position
    return ai.transpositionTable[(key + 2147483648) % 524287];
  }

  gameProgress() {
    let string = game.fen();
    if (!string.includes("Q") && !string.includes("q")) {
      return 1.0;
    } else {
      return 0.0;
    }
  }
  move(move) {
    if (ai.currentHash!=ai.zobrist.hashBoard()){
      console.log("desync")
      debugger;
    }
    const isValid = game.move(move);
    const j = move.from[0].charCodeAt(0) - 97;
    const i = 8 - parseInt(move.from[1]);
    const j2 = move.to[0].charCodeAt(0) - 97;
    const i2 = 8 - parseInt(move.to[1]);
    this.currentHash ^=
      this.zobrist.hash[Zobrist.piece(move.piece, move.color) + i + j * 8];
    this.currentHash ^=
      this.zobrist.hash[Zobrist.piece(move.piece, move.color) + i2 + j2 * 8];
    this.currentHash ^= this.zobrist.hash[780]; //last element

    if (move.flags.includes("c")) {
      this.currentHash ^=
        this.zobrist.hash[
          Zobrist.piece(move.captured, move.color == "w" ? "b" : "w") +
            i2 +
            j2 * 8
        ];
    }    
    if (ai.currentHash!=ai.zobrist.hashBoard()){
      //here put a break point!
      console.log("desync")
      debugger;
    }
    //ADD CASTLING RIGHTS ETC
  }

  undo() {
    const move = game.undo();
    const j = move.from[0].charCodeAt(0) - 97;
    const i = 8 - parseInt(move.from[1]);
    const j2 = move.to[0].charCodeAt(0) - 97;
    const i2 = 8 - parseInt(move.to[1]);
    this.currentHash ^=
      this.zobrist.hash[Zobrist.piece(move.piece, move.color) + i + j * 8];
    this.currentHash ^=
      this.zobrist.hash[Zobrist.piece(move.piece, move.color) + i2 + j2 * 8];
    this.currentHash ^= this.zobrist.hash[780]; //last element

    if (move.flags.includes("c")) {
      this.currentHash ^=
        this.zobrist.hash[
          Zobrist.piece(move.captured, move.color == "w" ? "b" : "w") +
            i2 +
            j2 * 8
        ];
    }
    //ADD CASTLING RIGHTS ETC
  }

  xorHashfromMove(move) {
    //we are one move away from the position

    let hash = this.currentHash;
    const j = move.from[0].charCodeAt(0) - 97;
    const i = 8 - parseInt(move.from[1]);
    const j2 = move.to[0].charCodeAt(0) - 97;
    const i2 = 8 - parseInt(move.to[1]);
    hash ^=
      this.zobrist.hash[Zobrist.piece(move.piece, move.color) + i + j * 8];
    hash ^=
      this.zobrist.hash[Zobrist.piece(move.piece, move.color) + i2 + j2 * 8];
    hash ^= this.zobrist.hash[780]; //last element
    //ADD CASTLING RIGHTS ETC

    if (move.flags.includes("c")) {
      hash ^=
        this.zobrist.hash[
          Zobrist.piece(move.captured, move.color == "w" ? "b" : "w") +
            i2 +
            j2 * 8
        ];
    }

    return hash;
  }
}

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

function see(from, to, color) {
  value =
    Math.abs(qEval(9 - to[1], to[0].charCodeAt(0) - 97)) -
    Math.abs(qEval(9 - from[1], from[0].charCodeAt(0) - 97));
  return value;
}

function isWhiteturn() {
  if (game.turn() == "w") {
    return 1;
  }
  return -1;
}

function getBestMove(game) {

  positionCount3 = 0;
  positionCount2 = 0;
  positionCount = 0;
  ai.PVmoves = [];

  let depth = parseInt($("#search-depth").find(":selected").text());

  let d = new Date().getTime();
  let bestMove = iterativeDeepening(depth, game, isWhiteturn());
  let d2 = new Date().getTime();
  let moveTime = d2 - d;
  let positionsPerS = (positionCount * 1000) / moveTime;

  $("#position-count").text(positionCount);
  $("#position-count2").text(positionCount2);
  $("#position-count3").text(positionCount3);
  $("#time").text(moveTime / 1000 + "s");
  $("#positions-per-s").text(positionsPerS);
  return bestMove.move;
}

function iterativeDeepening(depth, game, isWhiteturn){
  let bestMove=''
  for (let i=1; i<depth+1; i++){
    print("-----iterativeDeep------------"+i+"----------------",depth)
    bestMove = minimaxRoot(depth, game, isWhiteturn);
  }
  return bestMove
}

function evaluateBoard(board, debug = false, depth = null) {
  positionCount3++;
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + qEval(i, j);
    }
  }
  const moveAdvantage = game.moves({ verbose: true }).length - getOpponentMoves(game).length;
  const score = totalEvaluation + moveAdvantage;

  if (debug) {
    print(
      "score:" +
      score +
      "\n" +
      "moveAdvantage:" +
      moveAdvantage +
      "\n" +
      game.ascii()
    );
  }
  // rewrite
  // if (game.fen() in ai.transpositionTable) {
  //     if ( depth >= ai.transpositionTable[game.fen()].depth ){
  //       ai.addToTable(move) =
  //     }
  // }
  return score;
}

function qEval(i, j) {
  return getPieceValue(game.board()[i][j], i, j);
}

var getPieceValue = function (piece, x, y) {
  var a = String.fromCharCode(97 + y);
  var b = 9 - x;
  if (piece === null) {
    return 0;
  }
  var getAbsoluteValue = function (piece, isWhite, x, y) {
    if (piece.type === "p") {
      //PAWN
      return 100 + (isWhite ? pEvalWhite[x][y] : pEvalBlack[x][y]);
    } else if (piece.type === "r") {
      //ROOK/CHARIOT
      return 500 + (isWhite ? rEvalWhite[x][y] : rEvalBlack[x][y]);
    } else if (piece.type === "b") {
      //BISHOP
      return 350 + (isWhite ? bEvalWhite[x][y] : bEvalBlack[x][y]);
    } else if (piece.type === "n") {
      //KNIGHT
      return 300 + (isWhite ? nEvalWhite[x][y] : nEvalBlack[x][y]);
    } else if (piece.type === "q") {
      //QUEEN
      return 900 + (isWhite ? qEvalWhite[x][y] : qEvalBlack[x][y]);
    } else if (piece.type === "k") {
      //KING
      if (ai.gameProgress() <= 0.5) {
        return (
          99999 + (isWhite ? kEvalWhite_middle[x][y] : kEvalBlack_middle[x][y])
        );
      } else {
        return 99999 + (isWhite ? kEvalWhite_end[x][y] : kEvalBlack_end[x][y]);
      }
    }
    throw "Unknown piece type: " + piece.type;
  };

  let absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);
  return piece.color === "w" ? absoluteValue : -absoluteValue;
};

function ascii2(game) {
  //use ingame to show the value of each pieces

  let s = "   +------------------------------------------------+\n";
  for (let i = 0; i <= maxX; i++) {
    /// depen
    for (let j = -1; j <= maxY; j++) {
      /* display the rank */
      if (j === -1) {
        s += " " + "87654321"[i] + " |";
        j++;
      }

      /* empty piece */
      if (game.board()[i][j] == null) {
        s += " .... ";
      } else {
        let value = qEval(i, j);
        let color = game.board()[i][j].color;
        //let symbol = color === 'r' ? piece.toUpperCase() : piece.toLowerCase();
        if (Math.abs(value) > 9999) {
          value = "XXXX";
        } else if (value > 0) {
          value = "+" + value;
        }
        s += " " + value + " ";
      }
    }
    s += "|\n";
  }

  s += "   +------------------------------------------------+\n";
  s += "       a     b     c     d     e     f     g     h    \n";
  s += "score= " + evaluateBoard(game.board());

  print(s);
}

function quickSort(array, propertyArr) {
  // [most important, second most, etc]
  if (array.length <= 1) {
    return array;
  }

  let pivot = array[0]; 
  let left = [];
  let right = [];

  for (let i = 1; i < array.length; i++) {
    for (let j = 0; j < propertyArr.length; j++) {

      if (array[i][propertyArr[j]] != pivot[propertyArr[j]] || (j === propertyArr.length-1) ) {
        if (array[i][propertyArr[j]] > pivot[propertyArr[j]]) {
          left.push(array[i]);
        } else {
          right.push(array[i]);
        }
        break;
      }
    }
    //the property is eval
  }

  return quickSort(left, propertyArr).concat(
    pivot,
    quickSort(right, propertyArr)
  );
}

function quickSort2(array) {
  ////this only sort by a property
  if (array.length <= 1) {
    return array;
  }

  let pivot = array[0]; // choosing first index gives worst case scenario when the array is already sorted, but it's never going to be the case

  let left = [];
  let right = [];

  for (let i = 1; i < array.length; i++) {
    if (array[i].depth == pivot.depth) {
      array[i].score < pivot.score ? left.push(array[i]) : right.push(array[i]);
    } else {
      array[i].depth < pivot.depth ? left.push(array[i]) : right.push(array[i]);
    }
    //the property is eval
  }

  return quickSort2(left).concat(pivot, quickSort2(right));
}

class Zobrist {
  constructor() {
    this.hash = Array(12 * 64 + 4 + 8 + 1); //piece type, square, castling rights, en passant LOL, is it black's turn?
    // for (let i = 0; i < this.hash.length; i++) {
    //   this.hash[i] = Math.random() * 4294967296; //max number allowed in an array
    // }
    for (let i = 0; i < this.hash.length; i++) {
      this.hash[i] = (i / this.hash.length) * (4294967296 + 2147483648); //max number allowed in an array
    }
  }

  static piece(piece, color) {
    // P:0 N:1 B:2 R:3 Q:4 K:5 p:6 b:7 n:8 r:9 q:10 k:11
    let index = 0;
    if (color === "b") {
      index += 6;
    }
    if (piece === "p") {
    } else if (piece === "n") {
      index += 1;
    } else if (piece === "b") {
      index += 2;
    } else if (piece === "r") {
      index += 3;
    } else if (piece === "q") {
      index += 4;
    } else if (piece === "k") {
      index += 5;
    } else {
      throw piece + " is not a piece type!";
    }
    return index;
  }

  hashBoard() {
    let h = 0;
    for (let i = 0; i < game.board().length; i++) {
      for (let j = 0; j < game.board()[i].length; j++) {
        if (game.board()[i][j] != null) {
          h ^=
            this.hash[
              Zobrist.piece(game.board()[i][j].type, game.board()[i][j].color) +
                i +
                j * 8
            ];
        }
      }
    }
    //who's turn?
    if (game.turn() == "b") {
      h ^= this.hash[780];
    }
    return h;
  }
}
