const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const port = 8000
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json())

let board_state = Array(9).fill(null);
let winner = "";
let turn = "X"

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

Endpoints:

1. GET get_board_state
{
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}
  
2. POST play_move (int pos, string piece)
{
  success: true/false,
  state: [...],
  winner: "X" / "O" / ""
}

3. POST restart
{
  success: true/false
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
    success: true,
    state: board_state,
    winner: winner,
    turn: turn
  })
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
