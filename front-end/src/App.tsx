import React from 'react';
import './App.css';
import { GameState, Cell } from './game';
import BoardCell from './Cell';

interface Props { }

class App extends React.Component<Props, GameState> {
  private initialized: boolean = false;

  constructor(props: Props) {
    super(props)
    this.state = { cells: [], currentPlayer: 'X', winner: null, hasHistory: false }
  }

  newGame = async () => {
    const response = await fetch('/newgame');
    const json = await response.json();
    this.setState({
      cells: json['cells'],
      currentPlayer: json['currentPlayer'],
      winner: json['winner'],
      hasHistory: json['hasHistory']
    });
  }

  undo = async () => {
    const response = await fetch('/undo');
    const json = await response.json();
    this.setState({
      cells: json['cells'],
      currentPlayer: json['currentPlayer'],
      winner: json['winner'],
      hasHistory: json['hasHistory']
    });
  }

  play(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
      const response = await fetch(`/play?x=${x}&y=${y}`)
      const json = await response.json();
      this.setState({
        cells: json['cells'],
        currentPlayer: json['currentPlayer'],
        winner: json['winner'],
        hasHistory: json['hasHistory']
      });
    }
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playable)
      return (
        <div key={index}>
          <a href='/' onClick={this.play(cell.x, cell.y)}>
            <BoardCell cell={cell}></BoardCell>
          </a>
        </div>
      )
    else
      return (
        <div key={index}><BoardCell cell={cell}></BoardCell></div>
      )
  }

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
    const { winner, currentPlayer } = this.state;
    const instruction = winner
      ? `🎉 Тоглогч ${winner} яллаа!`
      : `Одоогийн нүүдэл: Тоглогч ${currentPlayer}`;

    return (
      <div>
        <div id="instructions">{instruction}</div>
        <div id="board">
          {this.state.cells.map((cell, i) => this.createCell(cell, i))}
        </div>
        <div id="bottombar">
          <button onClick={this.newGame}>New Game</button>
          <button onClick={this.undo}>Undo</button>
        </div>
      </div>
    );
  }
}

export default App;