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

var kEvalWhite_middle = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

var kEvalBlack_middle = reverseArray(kEvalWhite_middle);

var kEvalWhite_end = [
  [-30, -20, -10, 30, 30, -10, -20, -30],
  [-20, -10, 30, 10, 10, 30, -10, -20],
  [-10, 30, 10, 20, 20, 10, 30, -10],
  [30, 10, 20, 30, 30, 20, 10, 30],
  [30, 10, 20, 30, 30, 20, 10, 30],
  [-10, 30, 10, 20, 20, 10, 30, -10],
  [-20, -10, 30, 10, 10, 30, -10, -20],
  [-30, -20, -10, 30, 30, -10, -20, -30],
];

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

var kEvalBlack_end = reverseArray(kEvalWhite_end);

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
            totalEvaluation += stupidEval(square.type) * 100;
          } else {
            totalEvaluation -= stupidEval(square.type) * 100;
          }
        }
      }
    }
    let winning = Math.sign(totalEvaluation);
    totalEvaluation +=
      totalEvaluation *
      0.05 *
      (20 -
        Ai_Chess.distanceBetweenKings() +
        Ai_Chess.centerManhattanDistance(winning));
    // totalEvaluation = winning * totalEvaluation
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        // totalEvaluation += qEval(i, j);
        totalEvaluation += qEval2(i, j);
      }
    }
    // let whiteMoves;
    // let blackMoves;
    if (game.turn() === "w") {
      const whiteMoves = game.moves().length;
      if (whiteMoves === 0) return -Infinity; //u have been checkmated
      // blackMoves = getOpponentMoves(game).length;
    } else {
      const blackMoves = game.moves().length;
      if (blackMoves === 0) return Infinity;
      // whiteMoves = getOpponentMoves(game).length;
    }
    // totalEvaluation += whiteMoves - blackMoves;
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

function qEval2(i, j) {
  const piece = game.board()[i][j];
  if (piece !== null) {
    const color = piece.color === "w" ? 1 : -1;
    return color * getPieceSquare(piece.type, color === 1, i, j);
  } else {
    return 0;
  }
}

function getPieceSquare(piece, isWhite, x, y) {
  if (piece === "p") {
    //PAWN
    return 100 + (isWhite ? pEvalWhite[x][y] : pEvalBlack[x][y]);
  } else if (piece === "r") {
    //ROOK/CHARIOT
    return 500 + (isWhite ? rEvalWhite[x][y] : rEvalBlack[x][y]);
  } else if (piece === "b") {
    //BISHOP
    return 350 + (isWhite ? bEvalWhite[x][y] : bEvalBlack[x][y]);
  } else if (piece === "n") {
    //KNIGHT
    return 300 + (isWhite ? nEvalWhite[x][y] : nEvalBlack[x][y]);
  } else if (piece === "q") {
    //QUEEN
    return 900 + (isWhite ? qEvalWhite[x][y] : qEvalBlack[x][y]);
  } else if (piece === "k") {
    return 99999 + (isWhite ? kEvalWhite_end[x][y] : kEvalBlack_end[x][y]);
  }
  throw "Unknown piece type: " + piece;
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

function getPieceValue(piece, x, y, abs = false) {
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
