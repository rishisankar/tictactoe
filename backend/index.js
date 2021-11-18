/*
Initialization of Node.js / Express (you can ignore this)
*/
const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const port = 8000
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json())

/*
Create variables to keep track of the game state:
  - board_state is an array of 9 values representing the value at each square ("" / "X" / "O")
  - winner represents whether someone has won the game yet ("" / "X" / "O")
  - turn represents whose turn it is ("X" / "O")
You will need to update these within the endpoints.
*/
let board_state = Array(9).fill("");
let winner = "";
let turn = "X"

/*
This function calculates whether someone has won the game
given an array of sqauares (i.e. the board state).
Returns "" (no winner yet), "X", or "O"
*/
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return "";
}

/*

Endpoint description:

1. GET get_board_state (no params)
Returns game state:
{
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}

2. POST play_move (int pos, string piece)
Returns whether the move was valid + new game state:
{
  success: true/false,
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}

3. POST restart
Returns the reset game state:
{
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}

*/

app.get('/get_board_state', (req, res) => {
  res.json({
    state: board_state,
    winner: winner,
    turn: turn
  });
})

app.post('/play_move', function(req, res) {
  const pos = req.body.pos;
  const player = req.body.player
  let valid_move = false;
  if (player == "X" || player == "O") {
    if (turn == player && winner == "") {
      if (pos >= 0 && pos < 9) {
        if (board_state[pos] == null) {
          valid_move = true;
          board_state[pos] = player;
          winner = calculateWinner(board_state);
          if (turn == "X") {
            turn = "O";
          } else {
            turn = "X";
          }
        }
      }
    }
  }
  res.json({
    success: valid_move,
    state: board_state,
    winner: winner,
    turn: turn
  })
});

app.post('/restart', function(req, res) {
  board_state = Array(9).fill(null);
  winner = "";
  turn = "X";
  res.json({
    state: board_state,
    winner: winner,
    turn: turn
  })
});

// After all the endpoints, start the backend server!
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
