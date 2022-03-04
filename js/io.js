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