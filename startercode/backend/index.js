/*
Initialization of Node.js / Express (you can ignore this)
*/
const express = require('express')
const bodyParser = require('body-parser')
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

Endpoint description (using JSON responses)

1. GET /get_board_state (no params)
Responds with game state:
{
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}

2. POST /play_move (int pos, string player)
Responds with whether the move was valid + new game state:
{
  success: true/false,
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}

3. POST /restart
Responds with the reset game state:
{
  state: [...],
  winner: "X" / "O" / "",
  turn: "X" / "O" / ""
}

*/

/*
With Express, this is how to add an endpoint (app.get is a GET endpoint).
To send a JSON response, use:
  res.json(
    {
      field1: val1,
      field2: val2,
      ...
    }
  )
*/
app.get('/get_board_state', (req, res) => {
  // add code here!
})

/*
app.post corresponds to a POST endpoint.
POST endpoints can come with a request body (used to specify parameters), accessed like:
  let param1 = req.body.param1;
For this endpoint, we have two parameters, pos and player.

Things to do:
1) If it is the player's turn, nobody has won yet, and the specified pos is 
   empty / in array bounds, make the move (use if statements)
2) To make the move, update board_state, recalculate the winner, update whose turn it is
3) Send a JSON response with new game state. The success field should be true if the move was made.
   (use res.json as in the previous endpoint)
*/
app.post('/play_move', function(req, res) {
  // add code here!
});

/*
The final endpoint should reset the game state to restart the game.

Things to do:
1) Reset board_state, winner, turn to initial values
2) Send a JSON response with the resetted game state
*/
app.post('/restart', function(req, res) {
  // add code here!
});

// After all the endpoints, start up the backend server! (can ignore this)
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
