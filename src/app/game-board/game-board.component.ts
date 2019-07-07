import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { GameParams } from '../models/game-params';
import { Tile } from '../models/tile';
import { Coordinates } from '../models/coordinates';

export enum KEY_CODE {
  FIRE = 39,
  WALK = 37,
  TURN_LEFT = 79,
  TURN_RIGHT = 80
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  // Properties
  board: any;
  hunterX = 0;
  hunterY = 0;
  arrowsInCarcaj = 0;
  freeSpaces = 0;
  occupiedSpaces = [];
  hunterDirection = 0;

  myGameParams: GameParams;
  @Input('gameParams')
  set gameParams(params: GameParams) {
    this.myGameParams = params;

    this.startGame();
  }

  // Events
  @Output() endGame = new EventEmitter<any>();

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.key === 'Enter') {
      this.fire();
    } else if (event.key === ' ') {
      this.walk();
    } else if (event.keyCode === KEY_CODE.TURN_LEFT) {
      this.turnLeft();
    } else if (event.keyCode === KEY_CODE.TURN_RIGHT) {
      this.turnRight();
    }
  }

  constructor() { }

  ngOnInit() {
  }

  tile(row: number, col: number) {
    return this.board[row][col];
  }

  // Actions
  turnLeft() {
    this.hunterDirection -= 1;
    if (this.hunterDirection < 0) {
      this.hunterDirection = 3;
    }
  }

  turnRight() {
    this.hunterDirection += 1;
    if (this.hunterDirection > 3) {
      this.hunterDirection = 0;
    }
  }

  fire() {
    console.log('Fire');
  }

  walk() {
    console.log('Walk');
  }

  getHeight() {
    return this.myGameParams.height;
  }

  getWidth() {
    return this.myGameParams.width;
  }

  getArrowsInCarcaj() {
    return this.arrowsInCarcaj;
  }

  // getProperties() {
  //   const property = new Property();
  //   property.height = this.getHeight();
  //   property.width = this.getWidth();
  //   property.arrowsInCarcaj = this.arrowsInCarcaj;
  // }

  getTileImage(row: number, col: number) {
    if (this.tile(row, col).hasWumpus) {
      return 'W';
    } else if (this.tile(row, col).hasPit) {
      return '*P*';
    } else if (this.tile(row, col).hasGold) {
      return 'G';
    } else if (this.hunterY === row && this.hunterX === col) {
      return 'H';
    }
  }

  getHasBreeze(row: number, col: number) {
    if (this.tile(row, col).hasBreeze) {
      return '~';
    }
  }

  getHasStench(row: number, col: number) {
    if (this.tile(row, col).hasStench) {
      return ':';
    }
  }

  getIsVisible(row: number, col: number) {
    return this.tile(row, col).isVisible;
  }

  getIsGoldPosition(row: number, col: number) {
    return this.tile(row, col).hasGold;
  }

  getIsWumpusPosition(row: number, col: number) {
    return this.tile(row, col).hasWumpus && !this.tile(row, col).isWumpusDead;
  }

  getIsWumpusDeathPosition(row: number, col: number) {
    return this.tile(row, col).hasWumpus && this.tile(row, col).isWumpusDead;
  }

  getIsPitPosition(row: number, col: number) {
    return this.tile(row, col).hasPit;
  }

  getIsHunterPosition(row: number, col: number) {
    return (this.hunterY === row && this.hunterX === col);
  }

  startGame() {
    this.arrowsInCarcaj = this.myGameParams.arrowsCount;
    this.hunterX = 0;
    this.hunterY = 0;

    const boardTemp = new Array(this.myGameParams.height);
    for (let i = 0; i < this.myGameParams.width; i++) {
      boardTemp[i] = new Array(this.myGameParams.width);

      for (let z = 0; z < this.myGameParams.height; z++) {
        boardTemp[i][z] = new Tile();
      }
    }
    this.board = boardTemp.reverse();
    this.tile(0, 0).startPoint = true; // Reservar el espacio como punto de entrada
    this.tile(0, 0).isVisible = true;

    this.freeSpaces = (this.myGameParams.height * this.myGameParams.width) - 1;
    this.occupiedSpaces = new Array(this.freeSpaces);

    const positions: string[] = [];
    const positionsCount = this.myGameParams.pitsCount + 2;
    while (positions.length < positionsCount) {
      this.addPosition(positions);
    }

    const coords: Coordinates[] = [];
    positions.forEach(element => {
      const pos = element.split(',');
      const coord = new Coordinates();
      coord.row = +pos[0];
      coord.col = +pos[1];
      coords.push(coord);
    });
    this.tile(coords[0].row, coords[0].col).hasGold = true;

    for (let i = 1; i < coords.length; i++) {
      if (i === 1) {  // Colocar el Wumpus
        this.tile(coords[i].row, coords[i].col).hasWumpus = true;
      } else {        // Colocar un pozo
        this.tile(coords[i].row, coords[i].col).hasPit = true;
      }

      // Establecer percepciones en los adyacentes
      if (coords[i].row > 0) { // Arriba
        if (i === 1) {
          this.tile(coords[i].row - 1, coords[i].col).hasStench = true;
        } else {
          this.tile(coords[i].row - 1, coords[i].col).hasBreeze = true;
        }
      }
      if (coords[i].row < this.getHeight() - 1) { // Abajo
        if (i === 1) {
          this.tile(coords[i].row + 1, coords[i].col).hasStench = true;
        } else {
          this.tile(coords[i].row + 1, coords[i].col).hasBreeze = true;
        }
      }
      if (coords[i].col > 0) { // Izquierda
        if (i === 1) {
          this.tile(coords[i].row, coords[i].col - 1).hasStench = true;
        } else {
          this.tile(coords[i].row, coords[i].col - 1).hasBreeze = true;
        }
      }
      if (coords[i].col < this.getWidth() - 1) { // Derecha
        if (i === 1) {
          this.tile(coords[i].row, coords[i].col + 1).hasStench = true;
        } else {
          this.tile(coords[i].row, coords[i].col + 1).hasBreeze = true;
        }
      }

    }
  }

  addPosition(positions: string[]) {
    const row = this.getRamdomRow();
    let maxCols = this.getWidth();
    if (row === 0) {
      maxCols -= 1;
    }
    let col = this.getRamdomCol(maxCols);
    if (row === 0) {
      col += 1;
    }
    const pos: string = row + ',' + col;
    if (!positions.includes(pos)) {
      positions.push(pos);
    }

    return pos;
  }

  getRamdomRow() {
    const row = Math.round(Math.random() * (this.getHeight() - 1));
    return row;
  }

  getRamdomCol(maxCols) {
    const col = Math.round(Math.random() * (maxCols - 1));
    return col;
  }

  stopGame() {
    this.endGame.emit();
  }
}
