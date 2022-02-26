"use strict";
var debug = false;

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
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50],
];

var kEvalBlack_end = reverseArray(kEvalWhite_end);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function minimaxRoot(depth, game, color) {
  let newGameMoves = moveOrdering(depth);
  //use any negative large number
  let bestValue = -Infinity;
  let bestMoveFound;
  if (newGameMoves.length > 0) bestMoveFound = newGameMoves[0];

  for (let i = 0; i < newGameMoves.length; i++) {
    let newGameMove = newGameMoves[i];

    ai.move(newGameMove.move);

    // if (debug) {
    // print("CURRENT BRANCH:",depth);
    // print(game.ascii(),depth);
    // }

    if (i % 5 == 0) {
      console.log("move #" + i + " san:" + newGameMove.move.san);
    }
    let boardValue = -negaMax2(
      depth - 1,
      game,
      -Infinity,
      Infinity,
      color,
      newGameMove
    );

    // if (boardValue == bestValue) {
    //   if (Math.random() < 0.5) {
    //     bestMoveFound = newGameMove;
    //     print(
    //       "(rng) BLACK NEW TACTIC " +
    //         color * bestValue +
    //         "\n" +
    //         game.ascii() +
    //         " from move: " +
    //         newGameMove.move.san,
    //       depth
    //     );
    //   }
    // }

    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMoveFound = newGameMove;
      print(
        "BLACK NEW TACTIC " + color * bestValue + "\n" + game.ascii(),
        depth
      );
    }
    ai.undo();
  }
  ai.storeTranspositionTable(
    new TT_node({
      move: bestMoveFound.move,
      score: bestValue,
      depth: depth,
      key: ai.currentHash,
      nodeType: "EXACT",
    })
  );
  positionCount++;
  return bestMoveFound;
}

function negaMax2(depth, game, alpha, beta, color, move) {
  let alphaOrig = alpha;
  let ttEntry = ai.lookupTable(ai.currentHash);
  if (ttEntry === null) {
    // console.log("------------------------------------------");
    // console.log("------------------------------------------");
    // console.log("failed to find this hash:" + ai.currentHash + "    for the move:");
    // console.log(move);
    // console.log(game.ascii());
    ttEntry = new TT_node({
      score: null,
      depth: -1,
      key: ai.currentHash,
      nodeType: "UNKNOWN",
    });
    // ai.storeTranspositionTable( ttEntry )
  } else if (ttEntry.depth >= depth) {
    if (ttEntry.nodeType == "EXACT") {
      console.log("negamax ttable cut exact!");
      return ttEntry.score;
    } else if (ttEntry.nodeType == "LOWERBOUND") {
      alpha = Math.max(alpha, ttEntry.score);
    }
    // print("alpha! :" + alpha);
    // print("beta! :" + beta);
    else if (ttEntry.nodeType == "UPPERBOUND")
      beta = Math.min(beta, ttEntry.score);

    if (alpha >= beta) {
      return ttEntry.score;
    } //console.log("negamax beta cut!");
  }

  if (depth === 0) {
    return Quiesce(alpha, beta, 0, -color); // minus pour le minimax des noirs
  }

  let childNodes = moveOrdering(depth);
  let value = -Infinity;
  let lastMove = childNodes[0];

  if (childNodes.length > 0) {
    for (let child of childNodes) {
      ai.move(child.move);
      if (game.in_checkmate()) {
        ai.undo();
        value = Infinity;
        break;
      }

      value = Math.max(
        value,
        -negaMax2(depth - 1, game, -beta, -alpha, -color, child)
      );

      ai.undo();
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        lastMove = child;
        break;
      }
    }

    // Transposition Table Store; node is the lookup key for ttEntry
    ttEntry.score = value;
    if (value <= alphaOrig) ttEntry.nodeType = "UPPERBOUND";
    else if (value >= beta) ttEntry.nodeType = "LOWERBOUND";
    else ttEntry.nodeType = "EXACT";
    ttEntry.depth = depth;
    ttEntry.move = lastMove.move;
    ai.storeTranspositionTable(ttEntry);
  }

  positionCount++;
  return value;
}

function Quiesce(alpha, beta, depth, color) {
  let alphaOrig = alpha;
  let ttEntry = ai.lookupTable(ai.currentHash);
  if (ttEntry === null) {
    ttEntry = new TT_node({
      score: null,
      depth: -1,
      key: ai.currentHash,
      nodeType: "UNKNOWN",
    });
  } else if (ttEntry.depth > -1) {
    if (ttEntry.nodeType == "EXACT") {
      console.log("quiesce ttable cut exact!");
      return ttEntry.score;
    } else if (ttEntry.nodeType == "LOWERBOUND") {
      alpha = Math.max(alpha, ttEntry.score);
    } else if (ttEntry.nodeType == "UPPERBOUND")
      beta = Math.min(beta, ttEntry.score);

    if (alpha >= beta) {
      return ttEntry.score;
    } //console.log("quiesce beta cut!");
  }

  if (debug) {
    print(depth + ": QUIET");
  }
  depth += 1;

  let bestValue = color * evaluateBoard(game.board(), debug, depth); // minus pour le minimax des noirs

  if (bestValue >= beta) {
    return beta;
  }
  alpha = Math.max(alpha, bestValue);

  let allMoves = quiesMoveOrdering2(); //  game.moves({verbose: true}); //

  if (allMoves.length > 0) {
    let lastMove = allMoves[0];
    for (let i = 0; i < allMoves.length; i++) {
      let move = allMoves[i];
      // if (move.flags === "c") {
      //see(move.from, move.to, color) > 0){
      ai.move(move.move);
      if (debug) {
        print(move.iccs);
      }
      let score = -Quiesce(-beta, -alpha, depth, -color);
      ai.undo();

      alpha = Math.max(alpha, score);
      if (alpha >= beta) {
        lastMove = move;
        break;
      }

      // }
    }
    //print("quiesce best score was :" + color * bestValue, 2);

    ttEntry.score = alpha;
    if (alpha <= alphaOrig) ttEntry.nodeType = "UPPERBOUND";
    else if (alpha >= beta) ttEntry.nodeType = "LOWERBOUND";
    else ttEntry.nodeType = "EXACT";
    ttEntry.depth = 0;
    ttEntry.move = lastMove.move;
    ai.storeTranspositionTable(ttEntry);
  }

  positionCount2++;
  return alpha;
}

function Quiesce2(alpha, beta, depth, color) {
  return color * evaluateBoard(game.board(), debug, depth); // minus pour le minimax des noirs
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function quiesMoveOrdering2() {
  let movesOrdered = [];

  const gamesMoves = game
    .moves({ verbose: true })
    .filter((obj) => obj.flags === "c");

  for (let move of gamesMoves) {
    let key = ai.xorHashfromMove(move);

    let moveInTable = ai.transpositionTable[(key + 2147483648) % 524287];

    let node = { move: move, score: null, depth: -1 };

    switch (move.captured) {
      case "p":
        node.mvv = 1;
        break;
      case "n":
        node.mvv = 3;
        break;
      case "b":
        node.mvv = 3;
        break;
      case "r":
        node.mvv = 5;
        break;
      case "q":
        node.mvv = 9;
        break;
    }
    switch (move.piece) {
      case "p":
        node.lva = -1;
        break;
      case "n":
        node.lva = -3;
        break;
      case "b":
        node.lva = -3;
        break;
      case "r":
        node.lva = -5;
        break;
      case "q":
        node.lva = -9;
        break;
      case "k":
        node.lva = 0;
        break;
    }

    if (
      moveInTable != null &&
      moveInTable.key == node.key &&
      moveInTable.key == "EXACT"
    ) {
      //logic: even if the position only has a depth of 1, if the value is EXACT then it already did the Quiescence portion

      //add a case where its not the same move, then check +1
      node.score = moveInTable.score;
      node.depth = moveInTable.depth;
      movesOrdered.push(node);
    } else {
      // node.see
      movesOrdered.push(node);
    }
  }
  return quickSort(movesOrdered, ["depth", "mvv", "lva"]);
}

function moveOrdering(depth) {
  // bestSuggestedMove

  // let bestMove = ai.lookupTable[ ai.currentHash() ]

  let movesOrdered = [];
  const gamesMoves = game.moves({ verbose: true });

  for (let move of gamesMoves) {
    let key = ai.xorHashfromMove(move);

    let moveInTable = ai.transpositionTable[(key + 2147483648) % 524287];

    let node = { move: move, score: null, depth: -1 };

    if (move.flags.includes("c")) {
      switch (move.captured) {
        case "p":
          node.mvv = 1;
          break;
        case "n":
          node.mvv = 3;
          break;
        case "b":
          node.mvv = 3;
          break;
        case "r":
          node.mvv = 5;
          break;
        case "q":
          node.mvv = 9;
          break;
      }

      switch (move.piece) {
        case "p":
          node.mvv -= 1;
          break;
        case "n":
          node.mvv -= 3;
          break;
        case "b":
          node.mvv -= 3;
          break;
        case "r":
          node.mvv -= 5;
          break;
        case "q":
          node.mvv -= 9;
          break;
        case "k":
          node.mvv -= 0;
          break;
      }
    } else {
      node.mvv = 0;
    }

    //WE ONLY GET THE SCORE ! NOT THE MOVE, THE MOVE IS HOW IT COULD HAVE GONE TO THIS POSITION.

    //si les clés sont exactement pareils, ie: même position
    if (moveInTable != null && moveInTable.key == node.key) {
      node.score = moveInTable.score;
      node.depth = moveInTable.depth;

      //add a case where its not the same move, then check +1

      movesOrdered.push(node);
    } else {
      movesOrdered.push(node);
    }

    // if ( moveInTable === null){ ai.storeTranspositionTable(node) }
  }
  return quickSort(movesOrdered, ["depth", "mvv"]);
}
