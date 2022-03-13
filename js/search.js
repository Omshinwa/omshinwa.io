"use strict";
var debug = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function minimaxRoot(depth, color, time = 0) {
  let newGameMoves = moveOrdering();
  let bestValue = -Infinity;
  let bestMoveFound = null;
  if (newGameMoves.length > 0) {
    bestMoveFound = newGameMoves[0];
    for (let i = 0; i < newGameMoves.length; i++) {
      let newGameMove = newGameMoves[i];
      ai.move(newGameMove.move);

      let boardValue = -alphaBeta(depth - 1, -color, time, -Infinity, Infinity);

      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMoveFound = newGameMove.move

          print(
            color +
              " NEW TACTIC " +
              color * bestValue +
              "\n" +
              game.ascii() +
              "\nfrom move: " +
              bestMoveFound.san,
            depth
          );

      }
      ai.undo();
      if (boardValue === Infinity) {
        break;
      }
    }
  } else {
    if (game.in_stalemate()) value = 0;
  }

  ai.storeTranspositionTable(
    new TT_node({
      bestMove: bestMoveFound,
      score: bestValue,
      depth: depth,
      key: ai.currentHash,
      nodeType: "EXACT",
    })
  );

  positionCount++;
  return bestMoveFound;
}

function alphaBeta(depth, color, time = 0, alpha = -Infinity, beta = Infinity) {
  if (positionCount % 10 === 0) {
    if (time != 0) {
      let newTime = new Date().getTime();
      if (newTime - time > 5000) {
        return NaN;
      }
    }
  }
  if (game.in_threefold_repetition()) {
    return 0;
  }
  let alphaOrig = alpha;
  let ttEntry = ai.lookupTable(ai.currentHash);
  if (ttEntry === null) {
    ttEntry = new TT_node({
      score: null,
      depth: null,
      key: ai.currentHash,
      nodeType: "UNKNOWN",
    });
  } else if (ttEntry.depth >= depth) {
    if (ttEntry.nodeType == "EXACT") {
      return ttEntry.score;
    } else if (ttEntry.nodeType == "LOWERBOUND") {
      alpha = Math.max(alpha, ttEntry.score);
    } else if (ttEntry.nodeType == "UPPERBOUND")
      beta = Math.min(beta, ttEntry.score);

    if (alpha >= beta) {
      return ttEntry.score;
    }
  }

  if (game.in_check()) {
    depth++;
    searchController.maxDepth++;
  }

  if (depth === 0) {
    return Quiesce(alpha, beta, 0, color); 
  }

  let value = -Infinity;
  let legal = 0;
  let newValue = 0;
  let childNodes = [];
  if (game.in_check()) {
    childNodes = moveOrdering_evasion_checks();
  } else {
    childNodes = moveOrdering();
  }
  let bestmove = {move: null};

  if (childNodes.length > 0) {
    bestmove = childNodes[0];

    for (let child of childNodes) {
      legal++;
      ai.move(child.move);

      positionCount++;
      if (legal % 5 === 0 && depth === searchController.maxDepth) {
        console.log("move #" + legal + " san:" + child.move.san);
      }
      newValue = -alphaBeta(depth - 1, -color, time, -beta, -alpha);

      if (depth === searchController.maxDepth && newValue > value) {
        print(
          color +
            " NEW TACTIC " +
            newValue +
            "\n" +
            game.ascii() +
            "\nfrom move: " +
            child.move.san,
          depth
        );
      }

      ai.undo();
      
      
      if (newValue > value) {
        value = newValue;
      }
      else if (Number.isNaN(newValue)){ return NaN }

      if (value > alpha) {
        alpha = value;
        bestmove = child;
      }
      if (alpha >= beta) {
        if (legal === 1) {
          searchController.fhf++;
        }
        searchController.fh++;
        break;
      }
    }

  } else {
    if (game.in_stalemate()) value = 0;
    else value = -Infinity;
  }

  if (game.in_check()) {
    searchController.maxDepth--;
  }

  ttEntry.score = value;
  if (value <= alphaOrig) ttEntry.nodeType = "UPPERBOUND";
  else if (value >= beta) ttEntry.nodeType = "LOWERBOUND";
  else ttEntry.nodeType = "EXACT";
  ttEntry.depth = depth;
  ttEntry.bestMove = bestmove.move;
  ai.storeTranspositionTable(ttEntry);

  return value;
}

function Quiesce(alpha, beta, depth, color) {
  let bestValue = 0;
  bestValue = color * evaluateBoard(game.board(), debug, depth); // minus pour le minimax des noirs
  if (bestValue >= beta) {
    return beta;
  }
  alpha = Math.max(alpha, bestValue);
  let allMoves = quiesMoveOrdering(depth);
  depth -= 1;

  if (allMoves.length > 0) {
    // let bestmove = allMoves[0];
    for (let i = 0; i < allMoves.length; i++) {
      let move = allMoves[i];

      if (move.move.flags === "c" && seeCapture(move.move) < 0) {
        continue;
      }
      ai.move(move.move);
      const score = -Quiesce(-beta, -alpha, depth, -color);
      ai.undo();

      alpha = Math.max(alpha, score);
      if (alpha >= beta) {
        // bestmove = move;
        break;
      }
    }
  }

  positionCount2++;
  return alpha;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function quiesMoveOrdering(depth) {
  return moveOrdering_captures();

  //at depth 0 we should also add checking moves
  if (game.in_check()) {
    return moveOrdering_evasion_checks();
  } else if (depth < 0) {
    return moveOrdering_captures();
  } else {
    //deoth == 0
    return moveOrdering_captures_with_checks();
  }
}

function moveOrdering_captures_with_checks() {
  let movesOrdered = [];

  const gamesMoves = game
    .moves({ verbose: true })
    .filter((obj) => obj.flags === "c" || obj.san[obj.san.length - 1] === "+");

  for (let move of gamesMoves) {
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, score: null };
    let node = { move: move };

    node.mvv = rankingEval(move.captured);
    node.lva = -rankingEval(move.piece);

    let i = 0;
    for (i = 0; i < movesOrdered.length; i++) {
      if (node.mvv > movesOrdered[i].mvv) {
        break;
      } else if (
        node.mvv === movesOrdered[i].mvv &&
        node.lva > movesOrdered[i].lva
      ) {
        break;
      }
    }
    movesOrdered.splice(i, 0, node);
  }
  return movesOrdered;
}

function moveOrdering_captures() {
  let movesOrdered = [];

  const gamesMoves = game
    .moves({ verbose: true })
    .filter((obj) => obj.flags === "c");

  for (let move of gamesMoves) {
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, score: null };
    let node = { move: move };

    node.mvv = rankingEval(move.captured);
    node.lva = -rankingEval(move.piece);

    let i = 0;
    for (i = 0; i < movesOrdered.length; i++) {
      if (node.mvv > movesOrdered[i].mvv) {
        break;
      } else if (
        node.mvv === movesOrdered[i].mvv &&
        node.lva > movesOrdered[i].lva
      ) {
        break;
      }
    }
    movesOrdered.splice(i, 0, node);
  }
  return movesOrdered;
}

function moveOrdering() {
  let movesOrdered = [];
  const gamesMoves = game.moves({ verbose: true });
  let PVmove = ai.lookupTable(ai.currentHash);
  if (PVmove && PVmove.key == ai.currentHash) {
    PVmove = ai.lookupTable(ai.currentHash).bestMove;
  } else {
    PVmove = false;
  }
  for (let move of gamesMoves) {
    // if debug
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, orderScore: null };
    let node = { move: move, orderScore: null, priority: 7 };

    // 0:PV move   1:good capture   2:killers countermoves 3:quiet moves 4:bad captures

    if (PVmove && move.san === PVmove.san) {
      node.priority = 0;
    }
    //here check if it's in the killer move history
    else if (move.flags === "n") {
      node.priority = 2;
    } else if (move.flags.includes("c")) {
      const score = seeCapture(move);
      if (score >= 0) {
        node.priority = 1;
      } else {
        node.priority = 4;
      }
      node.orderScore = score;
    } else {
      node.priority = 2;
    }

    let i = 0;
    for (i = 0; i < movesOrdered.length; i++) {
      if (node.priority < movesOrdered[i].priority) {
        break;
      } else if (
        node.priority === movesOrdered[i].priority &&
        node.orderScore > movesOrdered[i].orderScore
      ) {
        break;
      }
    }
    movesOrdered.splice(i, 0, node);
  }
  return movesOrdered;
}

function moveOrdering_evasion_checks() {
  let movesOrdered = [];
  const gamesMoves = game.moves({ verbose: true });
  let pieceAttacker = getOpponentMoves().filter(
    (obj) => obj.captured === "k"
  )[0].piece;

  for (let move of gamesMoves) {
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, orderScore: null };
    let node = { move: move, orderScore: null };

    if (move.flags === "n") {
      if (move.piece == "k") {
        node.orderScore = 10 - rankingEval(pieceAttacker);
      } else {
        node.orderScore = 10 - rankingEval(move.piece);
      }
    } else if (move.flags.includes("c")) {
      node.orderScore = 100 - rankingEval(move.piece);
    }
    let i = 0;
    for (i = 0; i < movesOrdered.length; i++) {
      if (node.orderScore > movesOrdered[i].orderScore) {
        break;
      }
    }
    movesOrdered.splice(i, 0, node);
  }
  return movesOrdered;
}
