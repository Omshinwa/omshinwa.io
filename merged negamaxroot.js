
function minimaxRoot(depth, game, color, time = 0) {
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
  
  function negaMax(depth, alpha, beta, color) {

    if (depth === 0) {
        return Quiesce(alpha, beta, 0, color, game.in_check());
      }
      positionCount++;
    if (game.in_threefold_repetition()) {
      return 0;
    }
    if (game.in_check()) {
        depth++;
      }
    //doesnt work at depth 2 lol?
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