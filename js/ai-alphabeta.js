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
  [6, 5, 4, 3, 3, 4, 5, 6]
];

var kEvalBlack_end = reverseArray(kEvalWhite_end);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function minimaxRoot(depth, game, color, time=0) {
  let newGameMoves = moveOrdering();
  let bestValue = -Infinity;
  let bestMoveFound;

  if (newGameMoves.length > 0){ bestMoveFound = newGameMoves[0];

  for (let i = 0; i < newGameMoves.length; i++) {
    if (time!=0){
      let newTime = new Date().getTime();
      if (newTime - time > 5000){ return false }
    }
    let newGameMove = newGameMoves[i];

    ai.move(newGameMove.move);

    // if (debug) {
    // print("CURRENT BRANCH:",depth);
    // print(game.ascii(),depth);
    // }

    if (i % 5 == 0) {
      console.log("move #" + i + " san:" + newGameMove.move.san);
    }
    let boardValue = -negaMax2(depth - 1, game, -Infinity, Infinity, -color);

    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMoveFound = newGameMove;
      print(
        color + " NEW TACTIC " + color * bestValue + "\n" + game.ascii() + "\nfrom move: " +  bestMoveFound.move.san,
        depth
      );
    }
    ai.undo();
    if (boardValue === Infinity){
      break
    }
  }
  ai.storeTranspositionTable(
    new TT_node({
      bestMove: bestMoveFound.move,
      score: bestValue,
      depth: depth,
      key: ai.currentHash,
      nodeType: "EXACT",
    })
  );
}else{
    if (game.in_stalemate()) value = 0;

    ttEntry.score = value;
    ttEntry.nodeType = "EXACT";
    ttEntry.depth = depth;
    ttEntry.bestMove = null; //be careful with moveOrdering
    ai.storeTranspositionTable(ttEntry);
  }
  positionCount++;
  return bestMoveFound;
}

function negaMax2(depth, game, alpha, beta, color) {
  if (game.in_threefold_repetition()){return 0;} //doesnt work at depth 2 lol?
  let alphaOrig = alpha;
  let ttEntry = ai.lookupTable(ai.currentHash);
  if (ttEntry === null) {
    ttEntry = new TT_node({
      score: null,
      depth: null,
      key: ai.currentHash,
      nodeType: "UNKNOWN",
    });
    // ai.storeTranspositionTable( ttEntry )
  } else if (ttEntry.depth >= depth) {
    if (ttEntry.nodeType == "EXACT") {
      // console.log("negamax ttable cut exact!");
      return ttEntry.score;
    } else if (ttEntry.nodeType == "LOWERBOUND") {
      alpha = Math.max(alpha, ttEntry.score);
    } else if (ttEntry.nodeType == "UPPERBOUND")
      beta = Math.min(beta, ttEntry.score);

    if (alpha >= beta) {
      return ttEntry.score;
    }
  }

  if (depth === 0) {
    return Quiesce(alpha, beta, 0, color); // minus pour le minimax des noirs
  }

  let value = -Infinity;
  let childNodes = moveOrdering();
  let bestmove = null;

  if (childNodes.length > 0) {
    bestmove = childNodes[0];

    for (let child of childNodes) {
      ai.move(child.move);

      value = Math.max(
        value,
        -negaMax2(depth - 1, game, -beta, -alpha, -color)
      );

      ai.undo();

      if (value > alpha) {
        alpha = value;
        bestmove = child;
      }
      if (alpha >= beta) {
        break;
      }
    }

    // Transposition Table Store; node is the lookup key for ttEntry
    ttEntry.score = value;
    if (value <= alphaOrig) ttEntry.nodeType = "UPPERBOUND";
    else if (value >= beta) ttEntry.nodeType = "LOWERBOUND";
    else ttEntry.nodeType = "EXACT";
    ttEntry.depth = depth;
    ttEntry.bestMove = bestmove.move;
    ai.storeTranspositionTable(ttEntry);
  } else {

    if (game.in_stalemate()) value = 0;

    ttEntry.score = value;
    ttEntry.nodeType = "EXACT";
    ttEntry.depth = depth;
    ttEntry.bestMove = null; //be careful with moveOrdering
    ai.storeTranspositionTable(ttEntry);
  }
  //maybe store the TT even outside the if

  positionCount++;
  return value;
}

function Quiesce(alpha, beta, depth, color) {
  // let alphaOrig = alpha;
  // let ttEntry = ai.lookupTable(ai.currentHash);
  // if (ttEntry === null) {
  //   ttEntry = new TT_node({
  //     score: null,
  //     depth: null,
  //     key: ai.currentHash,
  //     nodeType: "UNKNOWN",
  //   });
  // } else if (ttEntry.depth > -1) {
  //   if (ttEntry.nodeType == "EXACT") {
  //     console.log("quiesce ttable cut exact!");
  //     return ttEntry.score;
  //   } else if (ttEntry.nodeType == "LOWERBOUND") {
  //     alpha = Math.max(alpha, ttEntry.score);
  //   } else if (ttEntry.nodeType == "UPPERBOUND")
  //     beta = Math.min(beta, ttEntry.score);

  //   if (alpha >= beta) {
  //     return ttEntry.score;
  //   } //console.log("quiesce beta cut!");
  // }

  depth -= 1;

  let bestValue = color * evaluateBoard(game.board(), debug, depth); // minus pour le minimax des noirs

  if (bestValue >= beta) {
    return beta;
  }
  alpha = Math.max(alpha, bestValue);

  let allMoves = quiesMoveOrdering2(); //  game.moves({verbose: true}); //

  if (allMoves.length > 0) {
    let bestmove = allMoves[0];
    for (let i = 0; i < allMoves.length; i++) {
      let move = allMoves[i];
      if (seeCapture(move.move) > 0) {
        ai.move(move.move);
        if (debug) {
          print(move.iccs);
        }
        let score = -Quiesce(-beta, -alpha, depth, -color);
        ai.undo();

        alpha = Math.max(alpha, score);
        if (alpha >= beta) {
          bestmove = move;
          break;
        }
      }

      // }
    }

    // ttEntry.score =la;
    // if (alpha <= alphaOrig) ttEntry.nodeType = "UPPERBOUND";
    // else if (alpha >= beta) ttEntry.nodeType = "LOWERBOUND";
    // else ttEntry.nodeType = "EXACT";
    // ttEntry.depth = depth;
    // ttEntry.move = lastMove.move;
    // ai.storeTranspositionTable(ttEntry);
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

    let moveInTable = ai.lookupTable(key);

    let node = { move: move, key: key, depth: null, score: null };

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

    if (moveInTable != null && moveInTable.key == node.key) {
      node.score = moveInTable.score;
      node.depth = moveInTable.depth;
      movesOrdered.push(node);
    } else {
      // node.see
      movesOrdered.push(node);
    }
  }
  movesOrdered = quickSort2(movesOrdered, "lva", 1);
  movesOrdered = quickSort2(movesOrdered, "mvv", 1);
  movesOrdered = quickSort2(movesOrdered, "score", 1);
  return movesOrdered;
}

function moveOrdering() {
  let movesOrdered = [];
  const gamesMoves = game.moves({ verbose: true });

  // if (ai.lookupTable(ai.currentHash) != null){
  //   const PVmove = ai.lookupTable(ai.currentHash).bestMove
  // }

  for (let move of gamesMoves) {
    let key = ai.xorHashfromMove(move);
    let moveInTable = ai.lookupTable(key);
    let node = { move: move, key: key, depth: null, score: null };

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
      node.bestMove = moveInTable.bestMove;

      //add a case where its not the same move, then check +1

      movesOrdered.push(node);
    } else {
      movesOrdered.push(node);
    }
  }
  movesOrdered = quickSort2(movesOrdered, "mvv", 1);
  movesOrdered = quickSort2(movesOrdered, "score", -1);
  movesOrdered = quickSort2(movesOrdered, "depth", 1);

  // put PV node at the top
  let moveInTable = ai.lookupTable(ai.currentHash)
  if (moveInTable && moveInTable.bestMove && movesOrdered.length>1){
    if (moveInTable.bestMove != movesOrdered[0].move){
      for (let i=0; i<movesOrdered.length; i++){
        if (movesOrdered[i].move.san === moveInTable.bestMove.san){
          movesOrdered.unshift(movesOrdered.splice(i, 1)[0])
        }
      }
    }
  }
  return movesOrdered;
}
