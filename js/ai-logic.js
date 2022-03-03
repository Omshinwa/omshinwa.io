"use strict";

let maxX = 7;
let maxY = 7;
var positionCount = 0;
var positionCount2 = 0;
var positionCount3 = 0;
var previousQuiesMoves = [];

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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function autoPlay() {
  while (game.game_over() == false) {
    makeRandomMove();
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
    window.setTimeout(function () {
      alert("Game over");
    }, 250);
  }
}

class TT_node {
  constructor({
    bestMove = null,
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
    this.bestMove = bestMove;
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
    } else if (ttEntry.depth > oldHash.depth || oldHash.key != ttEntry.key) {
      // if( oldHash.score != Infinity && oldHash.score != -Infinity ){ // otherwise he keeps rewriting short checkmates with longer ones
      console.log("replaced " + oldHash.key);
      if (oldHash.key != ttEntry.key) console.log(" with " + ttEntry.key);
      this.transpositionTable[(ttEntry.key + 2147483648) % 524287] = ttEntry;
      // }
    }
  }

  lookupTable(key) {
    //return the moveObj corresponding to the current position
    return ai.transpositionTable[(key + 2147483648) % 524287];
  }

  gameProgress() {
    let string = game.fen();
    if (!string.includes("Q") || !string.includes("q")) {
      return 1.0;
    } else {
      return 0.0;
    }
  }
  move(move) {
    this.currentHash = this.xorHashfromMove(move);
    const isValid = game.fast_move(move);

    if (ai.currentHash != ai.zobrist.hashBoard() || isValid === false) {
      console.log("desync");
      debugger;
    }
    //ADD CASTLING RIGHTS ETC
  }

  undo() {
    const move = game.undo();
    this.currentHash = this.xorHashfromMove(move);
  }

  xorHashfromMove(move, hash = this.currentHash) {
    //we are one move away from the position

    const j = move.from[0].charCodeAt(0) - 97;
    const i = 8 - parseInt(move.from[1]);
    const j2 = move.to[0].charCodeAt(0) - 97;
    const i2 = 8 - parseInt(move.to[1]);
    hash ^=
      this.zobrist.hash[
        Zobrist.piece(move.piece, move.color) * 64 + (j + i * 8)
      ];
    hash ^=
      this.zobrist.hash[
        Zobrist.piece(move.piece, move.color) * 64 + (j2 + i2 * 8)
      ];

    hash ^= this.zobrist.hash[780]; // turn change

    if (move.flags === "n" || move.flags === "b") {
      //ok nothing to see here
    } else if (move.flags === "c") {
      hash ^=
        this.zobrist.hash[
          Zobrist.piece(move.captured, move.color === "w" ? "b" : "w") * 64 +
            (j2 + i2 * 8)
        ];
    } else if (move.flags === "k") {
      if (move.color === "w") {
        //check if i should use var or define the let outside?
        var row = 7;
        var index = 0;
      } else {
        var row = 0;
        var index = 2;
      }
      hash ^=
        this.zobrist.hash[Zobrist.piece("r", move.color) * 64 + (row * 8 + 7)]; //h1
      hash ^=
        this.zobrist.hash[Zobrist.piece("r", move.color) * 64 + (row * 8 + 5)]; //f1

      //the hashBoard cant hash the castling rights rn
      // hash ^= this.zobrist.hash[12 * 64 + index]; //f1   12 * 64 + 4
    } else if (move.flags === "q") {
      if (move.color === "w") {
        var row = 7;
        var index = 1;
      } else {
        var row = 0;
        var index = 3;
      }
      hash ^=
        this.zobrist.hash[Zobrist.piece("r", move.color) * 64 + (row * 8 + 0)]; //a1
      hash ^=
        this.zobrist.hash[Zobrist.piece("r", move.color) * 64 + (row * 8 + 3)]; //d1
      // hash ^= this.zobrist.hash[12 * 64 + index]; //f1   12 * 64 + 4
    } else if (move.flags === "e") {
      let row = move.color === "w" ? 3 : 4;
      hash ^=
        this.zobrist.hash[
          Zobrist.piece("p", move.color === "w" ? "b" : "w") * 64 +
            (row * 8 + j2)
        ];
    } else if (move.flags === "np") {
      hash ^=
        this.zobrist.hash[
          Zobrist.piece(move.piece, move.color) * 64 + (j2 + i2 * 8)
        ];
      hash ^=
        this.zobrist.hash[Zobrist.piece(move.promotion, move.color) * 64 + (j2 + i2 * 8)];
    } else if (move.flags === "cp") {
      hash ^=
        this.zobrist.hash[
          Zobrist.piece(move.captured, move.color == "w" ? "b" : "w") * 64 +
            (j2 + i2 * 8)
        ];
      hash ^=
        this.zobrist.hash[
          Zobrist.piece(move.piece, move.color) * 64 + (j2 + i2 * 8)
        ];
      hash ^=
        this.zobrist.hash[Zobrist.piece(move.promotion, move.color) * 64 + (j2 + i2 * 8)];
    }

    return hash;
  }

  // @staticmethod
  static distanceBetweenKings() {
    let where = [];
    for (let i = 0; i < game.board().length; i++) {
      for (let j = 0; j < game.board()[i].length; j++) {
        if (game.board()[i][j] != null && game.board()[i][j].type === "k")
          where.push([i, j]);
      }
    }
    return (
      Math.abs(where[0][0] - where[1][0]) + Math.abs(where[0][1] - where[1][1])
    );
  }

  static kingMoves(i) {
    if (i === 0) {
      return game.moves({ verbose: true }).filter((obj) => obj.piece === "k")
        .length;
    }
    let moveCount = 0;
    let moves = game
      .moves({ verbose: true })
      .filter((obj) => obj.piece === "k");
    for (let move of moves) {
      game.fast_move(move);
      game.fast_move("--");
      moveCount += Ai_Chess.kingMoves(i - 1);
      game.fast_move("--");
      game.undo();
    }
    return moveCount;
  }

  static evalKingMoves(i = 0) {
    let whiteMoves = 0;
    let blackMoves = 0;
    if (game.turn() === "w") {
      whiteMoves = Ai_Chess.kingMoves(i);
      game.fast_move("--");
      blackMoves = Ai_Chess.kingMoves(i);
    } else if (game.turn() === "b") {
      blackMoves = Ai_Chess.kingMoves(i);
      game.fast_move("--");
      whiteMoves = Ai_Chess.kingMoves(i);
    }
    game.fast_move("--");
    return whiteMoves - blackMoves;
  }

  static centerManhattanDistance(totalEvaluation) {
    if (totalEvaluation == 0) return 0;
    let color = "w";
    let score = 0;
    if (totalEvaluation > 0) {
      color = "b";
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          game.board()[i][j] != null &&
          game.board()[i][j].type === "k" &&
          game.board()[i][j].color === color
        ) {
          score = arrCenterManhattanDistance[i][j];
          break;
        }
      }
    }
    return score;
  }
}

function get_smallest_attacker(x, y, square) {
  const gameMoves = game
    .moves({ verbose: true })
    .filter((obj) => obj.to === square);
  let bestMove = false;
  let value = 9999;
  for (let move of gameMoves) {
    const j = move.from[0].charCodeAt(0) - 97;
    const i = 8 - parseInt(move.from[1]);
    if (qEval(i, j, 1) < value) {
      value = qEval(i, j, 1);
      bestMove = move;
    }
  }
  return bestMove;
}

function see(x, y, square) {
  let value = 0;
  let move = get_smallest_attacker(x, y, square);
  if (move) {
    const vCapture = stupidEval(move.captured);
    game.fast_move(move);
    value = Math.max(0, vCapture - see(x, y, square));
    game.undo();
  }
  return value;
}

function seeCapture(move) {
  let value = 0;
  const j2 = move.to[0].charCodeAt(0) - 97;
  const i2 = 8 - parseInt(move.to[1]);
  const vCapture = stupidEval(move.captured);
  // debugger;
  game.fast_move(move);
  value = vCapture - see(i2, j2, move.to);
  game.undo();
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

  let depth = document.getElementById("search-depth").value;

  let startTime = new Date().getTime();
  let bestMove = iterativeDeepening(game, isWhiteturn(), startTime, depth);
  let d2 = new Date().getTime();
  let moveTime = d2 - startTime;
  let positionsPerS = (positionCount * 1000) / moveTime;

  $("#position-count").text(positionCount);
  $("#position-count2").text(positionCount2);
  $("#position-count3").text(positionCount3);
  $("#time").text(moveTime / 1000 + "s");
  $("#positions-per-s").text(positionsPerS);
  return bestMove.move;
}

function iterativeDeepening(game, isWhiteturn, time, depth = 0) {
  let bestMove = "";
  let newTime = new Date().getTime();
  if (depth > 0) {
    for (let i = 1; i < depth + 1; i++) {
      print("-----iterativeDeep------------" + i + "----------------", depth);
      bestMove = minimaxRoot(i, game, isWhiteturn, 0);
    }
  } else {
    let i = 1;
    let searchedMove = "";
    while (newTime - time < 5000) {
      print("-----iterativeDeep------------" + i + "----------------", depth);
      searchedMove = minimaxRoot(i, game, isWhiteturn, i<2? 0:time);
      if (searchedMove) {
        bestMove = searchedMove;
      }
      i++;
      newTime = new Date().getTime();
    }
  }
  return bestMove;
}

function evaluateBoard(board, debug = false, depth = null) {
  positionCount3++;
  if (game.in_stalemate()) return 0;
  let totalEvaluation = 0;

  if (ai.gameProgress() > 0.5) {
    let whiteMoves;
    let blackMoves;
    if (game.turn() === "w") {
      whiteMoves = game.moves().length;
      if (whiteMoves === 0) return -Infinity; //u have been checkmated
      blackMoves = getOpponentMoves(game).length;
    } else {
      blackMoves = game.moves().length;
      if (blackMoves === 0) return Infinity;
      whiteMoves = getOpponentMoves(game).length;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let square = game.board()[i][j];
        if (square != null) {
          if (square.color === "w") {
            totalEvaluation += stupidEval(square.type)*100;
          } else {
            totalEvaluation -= stupidEval(square.type)*100;
          }
        }
      }
    }
    let winning = Math.sign(totalEvaluation);
    totalEvaluation +=
      totalEvaluation * 0.05 *
      (20 -
        Ai_Chess.distanceBetweenKings() +
        Ai_Chess.centerManhattanDistance(winning));
    // totalEvaluation = winning * totalEvaluation
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        totalEvaluation += qEval(i, j);
      }
    }
    let whiteMoves;
    let blackMoves;
    if (game.turn() === "w") {
      whiteMoves = game.moves().length;
      if (whiteMoves === 0) return -Infinity; //u have been checkmated
      blackMoves = getOpponentMoves(game).length;
    } else {
      blackMoves = game.moves().length;
      if (blackMoves === 0) return Infinity;
      whiteMoves = getOpponentMoves(game).length;
    }
    //redundant because in negamax, if there's no move it returns -infinity anyway so it never reaches eval usually
    totalEvaluation += whiteMoves - blackMoves;
  }
  if (debug) {
    print(
      "score:" +
        totalEvaluation +
        "\n" +
        "moveAdvantage:" +
        (myMoves.length - oppMoves.length) +
        "\n" +
        game.ascii()
    );
  }
  return totalEvaluation;
}

function qEval(i, j, abs = false) {
  return getPieceValue(game.board()[i][j], i, j, abs);
}

function stupidEval(piece) {
  switch (piece) {
    case "p":
      return 1;
    case "n":
      return 3;
    case "b":
      return 3;
    case "r":
      return 5;
    case "q":
      return 9;
    case "k":
      return 99;
  }
}

function getPieceValue(piece, x, y, abs = false) {
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
  if (abs) {
    return absoluteValue;
  } else {
    return piece.color === "w" ? absoluteValue : -absoluteValue;
  }
}

function ascii2() {
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
      if (
        array[i][propertyArr[j]] != pivot[propertyArr[j]] ||
        j === propertyArr.length - 1
      ) {
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

function quickSort2(array, property, bigFirst = 1) {
  ////this only sort by a property
  if (array.length <= 1) {
    return array;
  }

  let pivot = array[0];
  let left = [];
  let right = [];

  for (let i = 1; i < array.length; i++) {
    if (array[i][property] == pivot[property]) {
      right.push(array[i]);
    } else {
      bigFirst * array[i][property] < bigFirst * pivot[property]
        ? right.push(array[i])
        : left.push(array[i]);
    }
  }

  return quickSort2(left, property, bigFirst).concat(
    pivot,
    quickSort2(right, property, bigFirst)
  );
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
              Zobrist.piece(game.board()[i][j].type, game.board()[i][j].color) *
                64 +
                (i * 8 + j)
            ];
        }
      }
    }
    //who's turn?
    if (game.turn() == "b") {
      h ^= this.hash[780];
    }
    return h;

    //castlings etc
  }
}
