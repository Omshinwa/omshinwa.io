"use strict";
var debug = false;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function minimaxRoot(depth, game, color, time = 0) {
  
  if (game.in_check()) { depth ++ }

  let newGameMoves = moveOrdering();
  let bestValue = -Infinity;
  let bestMoveFound;

  if (newGameMoves.length > 0) {
    bestMoveFound = newGameMoves[0];

    for (let i = 0; i < newGameMoves.length; i++) {
      if (time != 0) {
        let newTime = new Date().getTime();
        if (newTime - time > 5000) {
          return false;
        }
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
          color +
            " NEW TACTIC " +
            color * bestValue +
            "\n" +
            game.ascii() +
            "\nfrom move: " +
            bestMoveFound.move.san,
          depth
        );
      }
      ai.undo();
      if (boardValue === Infinity) {
        break;
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
  } else {
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
  if (game.in_threefold_repetition()) {
    return 0;
  } //doesnt work at depth 2 lol?
  if (game.in_check()) { depth ++ }
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
    return Quiesce(alpha, beta, 0, color, game.in_check()); // minus pour le minimax des noirs
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
  let bestValue = 0
  depth -= 1;
  bestValue = color * evaluateBoard(game.board(), debug, depth); // minus pour le minimax des noirs
  if (bestValue >= beta) {
    return beta;
  }
  alpha = Math.max(alpha, bestValue);

  if (game.in_check()) {
    let allMoves = moveOrdering_evasion_checks();
    if (allMoves.length > 0) {
      // let bestmove = allMoves[0];
      for (let i = 0; i < allMoves.length; i++) {
        let move = allMoves[i];
        ai.move(move.move);
        let score = -Quiesce(-beta, -alpha, depth, -color);
        ai.undo();
        alpha = Math.max(alpha, score);
        if (alpha >= beta) {
          // bestmove = move;
          break;
        }
      }
    }
  } //if there's a check
  else {
    let allMoves = quiesMoveOrdering();

    if (allMoves.length > 0) {
      // let bestmove = allMoves[0];
      for (let i = 0; i < allMoves.length; i++) {
        let move = allMoves[i];
        if (seeCapture(move.move) > 0) {
          ai.move(move.move);

          let score = -Quiesce(-beta, -alpha, depth, -color);
          ai.undo();

          alpha = Math.max(alpha, score);
          if (alpha >= beta) {
            // bestmove = move;
            break;
          }
        }
      }
    }
  }

  positionCount2++;
  // if( game.in_check() ){
  //   return color*-999998
  // }
  return alpha;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function quiesMoveOrdering() {
  let movesOrdered = [];

  const gamesMoves = game
    .moves({ verbose: true })
    .filter((obj) => obj.flags === "c");

  for (let move of gamesMoves) {
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, score: null };
    let node = { move: move };

    node.mvv = rankingEval(move.captured)
    node.lva = -rankingEval(move.piece)

  let i = 0;
  for(i=0; i< movesOrdered.length; i++){
    if (node.mvv > movesOrdered[i].mvv){
      break
    }
    else if (node.mvv === movesOrdered[i].mvv && node.lva > movesOrdered[i].lva){
      break
    }
  }
  movesOrdered.splice(i, 0, node);
}
  return movesOrdered;
}

function moveOrdering() {
  let movesOrdered = [];
  const gamesMoves = game.moves({ verbose: true });
  let PVmove = ai.lookupTable(ai.currentHash)
  if (PVmove && PVmove.key == ai.currentHash){ PVmove = ai.lookupTable(ai.currentHash).bestMove
  }
  else{PVmove = false}
  for (let move of gamesMoves) {

    // if debug
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, orderScore: null };
    let node = { move: move, orderScore: null, priority:7};

    // 0:PV move   1:good capture   2:killers countermoves 3:quiet moves 4:bad captures

    if(PVmove && move.san === PVmove.san){node.priority = 0}
    //here check if it's in the killer move history
    else if (move.flags === "n") {
      node.priority = 2
    }
    else if (move.flags.includes("c")) {
      const score = seeCapture(move)
      if (score >= 0){node.priority = 1}
      else{node.priority = 4}
      node.orderScore = score
    }
    else {node.priority = 2}

    let i = 0;
    for(i=0; i< movesOrdered.length; i++){
      if (node.priority < movesOrdered[i].priority){
        break
      }
      else if (node.priority === movesOrdered[i].priority && node.orderScore > movesOrdered[i].orderScore){
        break
      }
    }
    movesOrdered.splice(i, 0, node);
  }
  return movesOrdered;
}

function moveOrdering_evasion_checks() {
  let movesOrdered = [];
  const gamesMoves = game.moves({ verbose: true });
  let pieceAttacker = getOpponentMoves().filter((obj) => obj.captured === "k")[0].piece;

  for (let move of gamesMoves) {
    // let key = ai.xorHashfromMove(move);
    // let node = { move: move, key: key, orderScore: null };
    let node = { move: move, orderScore: null };

    if (move.flags === "n") {
      if (move.piece == "k"){ node.orderScore = 10 - rankingEval(pieceAttacker) }
      else{ node.orderScore = 10 - rankingEval(move.piece) }
    }
    else if (move.flags.includes("c")) {
      node.orderScore = 100 - rankingEval(move.piece)
    }
    let i = 0;
    for(i=0; i< movesOrdered.length; i++){
      if (node.orderScore > movesOrdered[i].orderScore){
        break
      }
    }
    movesOrdered.splice(i, 0, node);
  }
  return movesOrdered;
}
