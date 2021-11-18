import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: "",
    };
  }

  async updateBoardState() {
    try {
      const response = await fetch("http://localhost:8000/get_board_state", {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      });
      const responseJSON = await response.json();
      this.setState({
        squares: responseJSON.state,
        xIsNext: responseJSON.turn === "X",
        winner: responseJSON.winner
      });
    } catch (e) {

    }
  }

  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.setState({
      player: urlParams.get("p")
    })
    this.updateBoardState();
    const interval = setInterval(() => {
      this.updateBoardState();
    }, 500);
    this.setState({
      interval: interval
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  async handleClick(i) {
    try {
      const response = await fetch("http://localhost:8000/play_move", {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pos: i,
          player: this.state.player
        })
      });
      const responseJSON = await response.json();

      this.setState({
        squares: responseJSON.state,
        xIsNext: responseJSON.turn === "X",
        winner: responseJSON.winner
      });
    } catch (e) {

    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  async restartGame() {
    try {
      const response = await fetch("http://localhost:8000/restart", {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      });
      console.log(this.state.player);

      const responseJSON = await response.json();

      this.setState({
        squares: responseJSON.state,
        xIsNext: responseJSON.turn === "X",
        winner: responseJSON.winner
      });
    } catch (e) {

    }
  }

  setPlayer(pl) {
    this.setState({
      player: pl
    })
  }

  getPlayerDiv() {
    if (this.state.player === "X" || this.state.player === "O") {
      return <div className="player">{"Player " + this.state.player}</div>
    } else {
      return (
        <div className="playerSelect">
          Choose player: 
          <button className="choosePlayer" onClick={() => this.setPlayer("X")}>X</button>
          <button className="choosePlayer" onClick={() => this.setPlayer("O")}>O</button>
        </div>
      )
    }
  }

  render() {
    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Turn: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="main-wrapper">
        {this.getPlayerDiv()}
        <div className="status">{status}</div>
        <button className="restartButton" onClick={() => this.restartGame()}>Restart Game</button>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
