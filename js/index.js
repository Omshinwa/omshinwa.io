var board = null;
var $board = $("#myBoard");
var game = new Chess();
var ai = new Ai_Chess(
  game,
  parseInt($("#search-depth").find(":selected").text())
);
// var zobrist = new Zobrist()
var whiteSquareGrey = "#a9a9a9";
var blackSquareGrey = "#696969";
var squareToHighlight = null;
var squareClass = "square-55d63";
var colorToHighlight = "";

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
let getOpponentMoves = (game) => {
  let gamePGN = game.pgn();

  let tokens = game.fen().split(" ");
  tokens[1] = tokens[1] === "w" ? "b" : "w";
  game.load(tokens.join(" "));

  let moves = game.moves();

  tokens = game.fen().split(" ");
  tokens[1] = tokens[1] === "w" ? "b" : "w";
  game.load_pgn(gamePGN);

  return moves;
};

function onDrop(source, target) {
  // see if the move is legal
  let move = game.move({
  from: source,
  to: target,
  promotion: 'q' // NOTE: always promote to a queen for example simplicity
  	});

  // illegal move
  if (move === null) return "snapback";

  ai.currentHash = ai.xorHashfromMove(move)

  removeHighlights("white");
  removeGreySquares();

  $board.find(".square-" + source).addClass("highlight-white");
  $board.find(".square-" + target).addClass("highlight-white");

  // make random move for black
  if ( document.getElementById("no_computer").checked == false)
  window.setTimeout(makeRandomMove, 250);

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
