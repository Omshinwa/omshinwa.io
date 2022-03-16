var board = null;
var $board = $("#myBoard");
var game = new Chess();
var ai = new Ai_Chess(
  parseInt($("#search-depth").find(":selected").text())
);
// var zobrist = new Zobrist()
var whiteSquareGrey = "#f9f9a9";
var blackSquareGrey = "#a9a969";
var squareToHighlight = null;
var squareClass = "square-55d63";
var colorToHighlight = "";
document.getElementById("hash").innerHTML = ai.currentHash

function removeGreySquares() {
  $("#myBoard .square-55d63").css("background", "");
}

function greySquare(square) {
  var $square = $("#myBoard .square-" + square);

  var background = whiteSquareGrey;
  if ($square.hasClass("black-3c85d")) {
    background = blackSquareGrey;
  }

  $square.css("background", background);

  $square.addClass("highlight");
}

function removeHighlights(color) {
  $board.find("." + squareClass).removeClass("highlight-" + color);
}

function onDragStart(source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // or if it's not that side's turn
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

/* untested, seems to save history so you can continue using .undo() */
let getOpponentMoves = () => {
  // return []
  game.null_move();
  let moves = game.moves({ legal: false, null_move: true });
  game.null_move();
  return moves;
};

function onDrop(source, target) {
  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  ai.currentHash = ai.xorHashfromMove(move);

  let color = "";
  color = move.color === "w" ? "white" : "black";
  removeHighlights(color);
  removeGreySquares();

  $board.find(".square-" + source).addClass("highlight-" + color);
  $board.find(".square-" + target).addClass("highlight-" + color);

  if (game.game_over()) {
    window.setTimeout(function () {
      alert("Game over");
    }, 250);
  } else {
    // make  move for black
    if (document.getElementById("no_computer").checked == false)
      window.setTimeout(makeAimove, 250);
  }

  document.getElementById("hash").innerHTML = ai.currentHash
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (let i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function onMoveEnd() {
  removeGreySquares();
  $board
    .find(".square-" + squareToHighlight)
    .addClass("highlight-" + colorToHighlight);
}

let config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onMoveEnd: onMoveEnd,
};
board = Chessboard("myBoard", config);
