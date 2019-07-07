import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { GameParams } from '../models/game-params';
import { Tile } from '../models/tile';
import { Coordinates } from '../models/coordinates';
import { ThrowStmt } from '@angular/compiler';

export enum KEY_CODE {
  FIRE = 13, // enter
  WALK = 32, // space
  TURN_LEFT = 65, // a
  TURN_RIGHT = 68 // d
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  // #region Properties
  board: any;
  hunterX = 0;
  hunterY = 0;
  arrowsInCarcaj = 0;
  freeSpaces = 0;
  occupiedSpaces = [];
  hunterDirection = 0;
  perceptions: string[];
  isWumpusDeath = false;
  isGoldFound = false;
  ended = false;

  myGameParams: GameParams;
  @Input('gameParams')
  set gameParams(params: GameParams) {
    this.myGameParams = params;
    this.startGame();
  }
  // #endregion


  // #region Events
  @Output() endGame = new EventEmitter<any>();

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.ended) {
      if (event.keyCode === KEY_CODE.FIRE) {
        this.fire();
      } else if (event.keyCode === KEY_CODE.WALK) {
        this.walk();
      } else if (event.keyCode === KEY_CODE.TURN_LEFT) {
        this.turnLeft();
      } else if (event.keyCode === KEY_CODE.TURN_RIGHT) {
        this.turnRight();
      }
    }
  }
  // #endregion


  constructor() { }

  ngOnInit() {
  }


  // #region Game functions
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

    // #region Crear posiciones aleatorias
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
    // #endregion

    // #region Colocar elementos
    for (let i = 0; i < coords.length; i++) {
      if (i === 0) {  // Colocar el oro
        this.tile(coords[i].row, coords[i].col).hasGold = true;
      } else if (i === 1) {  // Colocar el Wumpus
        this.tile(coords[i].row, coords[i].col).hasWumpus = true;
      } else {        // Colocar un pozo
        this.tile(coords[i].row, coords[i].col).hasPit = true;
      }

      // #region Establecer percepciones en los adyacentes
      if (coords[i].row > 0) { // Arriba
        if (i === 0) {  // Colocar el oro
          this.tile(coords[i].row - 1, coords[i].col).hasBrightness = true;
        } else if (i === 1) {
          this.tile(coords[i].row - 1, coords[i].col).hasStench = true;
        } else {
          this.tile(coords[i].row - 1, coords[i].col).hasBreeze = true;
        }
      }
      if (coords[i].row < this.getHeight() - 1) { // Abajo
        if (i === 0) {  // Colocar el oro
          this.tile(coords[i].row + 1, coords[i].col).hasBrightness = true;
        } else if (i === 1) {
          this.tile(coords[i].row + 1, coords[i].col).hasStench = true;
        } else {
          this.tile(coords[i].row + 1, coords[i].col).hasBreeze = true;
        }
      }
      if (coords[i].col > 0) { // Izquierda
        if (i === 0) {  // Colocar el oro
          this.tile(coords[i].row, coords[i].col - 1).hasBrightness = true;
        } else if (i === 1) {
          this.tile(coords[i].row, coords[i].col - 1).hasStench = true;
        } else {
          this.tile(coords[i].row, coords[i].col - 1).hasBreeze = true;
        }
      }
      if (coords[i].col < this.getWidth() - 1) { // Derecha
        if (i === 0) {  // Colocar el oro
          this.tile(coords[i].row, coords[i].col + 1).hasBrightness = true;
        } else if (i === 1) {
          this.tile(coords[i].row, coords[i].col + 1).hasStench = true;
        } else {
          this.tile(coords[i].row, coords[i].col + 1).hasBreeze = true;
        }
      }
      // #endregion
    }
    // #endregion

    this.hunterMoved();
  }

  stopGame() {
    this.endGame.emit();
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

  tile(row: number, col: number) {
    return this.board[row][col];
  }

  hunterMoved() {
    const tile = this.tile(this.hunterY, this.hunterX);

    this.perceptions = [];
    if (tile.hasWumpus) {
      this.perceptions.push('Aaaag ¡Te has encontrado con el Wumpus, que se te ha zampado!');
      this.ended = true;
    } else if (tile.hasPit) {
      this.perceptions.push('Aaaaaa ¡PUM! ¡Has caido en un pozo!');
      this.ended = true;
    }

    if (!this.ended) {
      if (tile.hasBrightness) {
        this.perceptions.push('Noto un brillo');
      }
      if (tile.hasBreeze) {
        this.perceptions.push('Noto una brisa');
      }
      if (tile.hasStench) {
        this.perceptions.push('Noto un hedor');
      }
      if (tile.hasGold) {
        if (!this.isGoldFound) {
          this.perceptions.push('¡BIEN! ¡He encontrado el oro!');
        }
        this.isGoldFound = true;

        // Quitar los brillos adyacentes
        if (this.hunterY > 0) {
          this.tile(this.hunterY - 1, this.hunterX).hasBrightness = false;
        }
        if (this.hunterX > 0) {
          this.tile(this.hunterY, this.hunterX - 1).hasBrightness = false;
        }
        if (this.hunterY < this.getHeight() - 1) {
          this.tile(this.hunterY + 1, this.hunterX).hasBrightness = false;
        }
        if (this.hunterX < this.getWidth() - 1) {
          this.tile(this.hunterY, this.hunterX + 1).hasBrightness = false;
        }
      }
    }
  }
  // #endregion


  // #region User actions
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
    let wall = false;
    let newY = this.hunterY;
    let newX = this.hunterX;

    switch (this.hunterDirection) {
      case 1:
        newY = this.hunterY + 1;
        if (newY > this.getHeight() - 1) {
          newY = this.hunterY;
          wall = true;
        }
        break;
      case 2:
        newX = this.hunterX - 1;
        if (newX < 0) {
          newX = this.hunterX;
          wall = true;
        }
        break;
      case 3:
        newY = this.hunterY - 1;
        if (newY < 0) {
          newY = this.hunterY;
          wall = true;
        }
        break;
      default:
        newX = this.hunterX + 1;
        if (newX > this.getWidth() - 1) {
          newX = this.hunterX;
          wall = true;
        }
        break;
    }

    this.hunterY = newY;
    this.hunterX = newX;
    this.hunterMoved();
    if (wall) {
      this.perceptions.push('HAS CHOCADO CONTRA EL MURO');
    }
  }
  // #endregion

  // #region Get values
  getRamdomRow() {
    const row = Math.round(Math.random() * (this.getHeight() - 1));
    return row;
  }

  getRamdomCol(maxCols) {
    const col = Math.round(Math.random() * (maxCols - 1));
    return col;
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

  getPerceptions() {
    return this.perceptions;
  }

  getWumpusDeath() {
    return this.isWumpusDeath;
  }

  getGoldFound() {
    return this.isGoldFound;
  }

  getHasBreeze(row: number, col: number) {
    return this.tile(row, col).hasBreeze;
  }

  getHasStench(row: number, col: number) {
    return this.tile(row, col).hasStench;
  }

  getIsStartPoint(row: number, col: number) {
    return row === 0 && col === 0;
  }

  getIsVisible(row: number, col: number) {
    return !(this.hunterY === 0 && this.hunterX === 0) && this.tile(row, col).isVisible;
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
  // #endregion
}
