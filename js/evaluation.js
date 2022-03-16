var reverseArray = function (array) {
  return array.slice().reverse();
};

var pEvalWhite = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var pEvalBlack = reverseArray(pEvalWhite);

var nEvalWhite = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

var nEvalBlack = reverseArray(nEvalWhite);

var bEvalWhite = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

var bEvalBlack = reverseArray(bEvalWhite);

var rEvalWhite = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

var rEvalBlack = reverseArray(rEvalWhite);

var qEvalWhite = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

var qEvalBlack = reverseArray(qEvalWhite);

var kEvalWhite = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

var kEvalBlack = reverseArray(kEvalWhite);

// var kEval_end = [
//   [-30, -20, -10, 30, 30, -10, -20, -30],
//   [-20, -10, 30, 10, 10, 30, -10, -20],
//   [-10, 30, 10, 20, 20, 10, 30, -10],
//   [30, 10, 20, 30, 30, 20, 10, 30],
//   [30, 10, 20, 30, 30, 20, 10, 30],
//   [-10, 30, 10, 20, 20, 10, 30, -10],
//   [-20, -10, 30, 10, 10, 30, -10, -20],
//   [-30, -20, -10, 30, 30, -10, -20, -30],
// ];

var arrCenterManhattanDistance = [
  [6, 5, 4, 3, 3, 4, 5, 6],
  [5, 4, 3, 2, 2, 3, 4, 5],
  [4, 3, 2, 1, 1, 2, 3, 4],
  [3, 2, 1, 0, 0, 1, 2, 3],
  [3, 2, 1, 0, 0, 1, 2, 3],
  [4, 3, 2, 1, 1, 2, 3, 4],
  [5, 4, 3, 2, 2, 3, 4, 5],
  [6, 5, 4, 3, 3, 4, 5, 6],
];

// @staticmethod
function distanceBetweenKings() {
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

function centerManhattanDistance(totalEvaluation) {
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

function evaluateBoard(board, debug = false, depth = null) {
  //todo
  //should return 3 values that the evaluateBoard decides to add or not
  //absolute total material (used for game progress), only material, and only squaretable bonus
  //maybe change the function into a relative score

  positionCount3++;
  if (game.in_stalemate()) return 0;
  let totalEvaluation = 0;
  let absoluteMaterial = 0;
  let materialOnly = 0;
  let middleGame = 0;
  let endGame = 0;

  if (game.turn() === "w") {
    const whiteMoves = game.moves().length;
    if (whiteMoves === 0) return -99999 - depth + searchController.maxDepth; // -Infinity // 
  } else {
    const blackMoves = game.moves().length;
    if (blackMoves === 0) return +99999 + depth - searchController.maxDepth; // Infinity; //  
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // totalEvaluation += qEval(i, j);
      const piece = game.board()[i][j];
      if (piece !== null) {
        const color = piece.color === "w" ? 1 : -1;
        middleGame +=
          color * getPieceSquare_middle(piece.type, color === 1, i, j);
        absoluteMaterial += stupidEval(piece.type);
        materialOnly += color * stupidEval(piece.type) * 100;

      }
    }
  }

  endGame +=
    Math.sign(materialOnly) *
    10 *
    (20 - distanceBetweenKings() + centerManhattanDistance(materialOnly));

  const gameProgress = Math.max(1 - (absoluteMaterial - 198) / 78, 0);
  // starts at 1, ends at 0

  totalEvaluation =
    materialOnly + (1 - gameProgress) * middleGame + gameProgress * endGame;

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

function qEval2(i, j) {
  const piece = game.board()[i][j];
  if (piece !== null) {
    const color = piece.color === "w" ? 1 : -1;
    return color * getPieceSquare_middle(piece.type, color === 1, i, j);
  } else {
    return 0;
  }
}

function getPieceSquare_middle(piece, isWhite, x, y) {
  if (piece === "p") {
    //PAWN
    return isWhite ? pEvalWhite[x][y] : pEvalBlack[x][y];
  } else if (piece === "r") {
    //ROOK/CHARIOT
    return isWhite ? rEvalWhite[x][y] : rEvalBlack[x][y];
  } else if (piece === "b") {
    //BISHOP
    return isWhite ? bEvalWhite[x][y] : bEvalBlack[x][y];
  } else if (piece === "n") {
    //KNIGHT
    return isWhite ? nEvalWhite[x][y] : nEvalBlack[x][y];
  } else if (piece === "q") {
    //QUEEN
    return isWhite ? qEvalWhite[x][y] : qEvalBlack[x][y];
  } else if (piece === "k") {
    return isWhite ? kEvalWhite[x][y] : kEvalBlack[x][y];
  }
  throw "Unknown piece type: " + piece;
}

function getPieceSquare_end(piece, isWhite, x, y) {
  if (piece === "k") {
    return kEval_end[x][y];
  } else {
    return 0;
  }
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

function rankingEval(piece) {
  switch (piece) {
    case "p":
      return 1;
    case "n":
      return 2;
    case "b":
      return 2;
    case "r":
      return 4;
    case "q":
      return 5;
    case "k":
      return 6;
  }
}
