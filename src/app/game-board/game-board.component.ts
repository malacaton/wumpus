import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { GameParams } from '../models/game-params';
import { Tile } from '../models/tile';
import { Coordinates } from '../models/coordinates';

export enum KEY_CODE {
  FIRE = 13, // enter
  EXIT = 32, // space
  WALK = 87, // w
  TURN_LEFT = 65, // a
  TURN_RIGHT = 68 // d
}

export enum MESSAGES {
  EATEN_BY_WUMPUS = 'Aaaag ¡Te has encontrado con el Wumpus, que se te ha zampado!',
  FALLEN_TO_WELL = 'Aaaaaa ¡PUM! ¡Has caido en un pozo!',
  BRIGHTNESS = 'Noto un brillo',
  BREEZE = 'Noto una brisa',
  STENCH = 'Noto un hedor',
  GOLD_FOUND = '¡BIEN! ¡He encontrado el oro!',
  NOT_ACCOMPLISHED = 'No puedes salir porque no has cumplido los objetivos',
  CARCAJ_IS_EMPTY = 'No te quedan flechas en el carcaj',
  ARROW_HIT_THE_WALL = '¡CLONK! La flecha ha chocado contra la pared',
  KILLED_THE_WUMPUS = '¡Muy bien¡ ¡Has matado al Wumpus!',
  HIT_THE_WALL = 'Has chocado contra el muro'
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
  isWumpusIsDead = false;
  isGoldFound = false;
  pickedGold = false;
  ended = false;
  tryingToLeave = false;
  steps = 0;
  done = false;

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
      } else if (event.keyCode === KEY_CODE.EXIT) {
        this.exit();
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
    const positionsCount = this.myGameParams.wellsCount + 2;
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
        this.tile(coords[i].row, coords[i].col).hasWell = true;
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
    tile.isVisible = true;

    // Cambiar el color del oro si ya está cogido
    if (this.isGoldFound && !tile.hasGold && !this.pickedGold) {
      this.pickedGold = true;
    }

    this.perceptions = [];
    if (tile.hasWumpus && !this.isWumpusIsDead) {
      this.perceptions.push(MESSAGES.EATEN_BY_WUMPUS);
      this.ended = true;
    } else if (tile.hasWell) {
      this.perceptions.push(MESSAGES.FALLEN_TO_WELL);
      this.ended = true;
    }

    if (!this.ended) {
      if (tile.hasBrightness) {
        this.perceptions.push(MESSAGES.BRIGHTNESS);
      }
      if (tile.hasBreeze) {
        this.perceptions.push(MESSAGES.BREEZE);
      }
      if (tile.hasStench && !this.isWumpusIsDead) {
        this.perceptions.push(MESSAGES.STENCH);
      }
      if (tile.hasGold) {
        if (!this.isGoldFound) {
          this.isGoldFound = true;
          this.perceptions.push(MESSAGES.GOLD_FOUND);
        }

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

      if (this.tryingToLeave) {
        this.perceptions.push(MESSAGES.NOT_ACCOMPLISHED);
        this.tryingToLeave = false;
      }
    }
  }
  // #endregion


  // #region User actions
  turnLeft() {
    // this.tryingToLeave = false;

    this.hunterDirection -= 1;
    if (this.hunterDirection < 0) {
      this.hunterDirection = 3;
    }
  }

  turnRight() {
    // this.tryingToLeave = false;

    this.hunterDirection += 1;
    if (this.hunterDirection > 3) {
      this.hunterDirection = 0;
    }
  }

  fire() {
    // this.tryingToLeave = false;

    if (this.arrowsInCarcaj === 0) {
      this.perceptions.push(MESSAGES.CARCAJ_IS_EMPTY);
    } else {
      this.arrowsInCarcaj -= 1;
      let y = this.hunterY;
      let x = this.hunterX;
      let hitWall = false;
      let hitWumpus = false;
      let tile = this.tile(y, x);
      while (true) {
        if (this.hunterDirection === 0) {
          x += 1;
          if (x === this.getWidth()) {
            hitWall = true;
            break;
          } else {
            tile = this.tile(y, x);
            if (tile.hasWumpus) {
              hitWumpus = true;
              break;
            }
          }
        } else if (this.hunterDirection === 1) {
          y += 1;
          if (y === this.getHeight()) {
            hitWall = true;
            break;
          } else {
            tile = this.tile(y, x);
            if (tile.hasWumpus) {
              hitWumpus = true;
              break;
            }
          }
        } else if (this.hunterDirection === 2) {
          x -= 1;
          if (x < 0) {
            hitWall = true;
            break;
          } else {
            tile = this.tile(y, x);
            if (tile.hasWumpus) {
              hitWumpus = true;
              break;
            }
          }
        } else if (this.hunterDirection === 3) {
          y -= 1;
          if (y < 0) {
            hitWall = true;
            break;
          } else {
            tile = this.tile(y, x);
            if (tile.hasWumpus) {
              hitWumpus = true;
              break;
            }
          }
        }
      }

      if (hitWall) {
        this.perceptions.push(MESSAGES.ARROW_HIT_THE_WALL);
      }

      if (hitWumpus) {
        tile.isWumpusDead = true;
        tile.isWumpusDead = true;
        this.isWumpusIsDead = true;
        this.perceptions.push(MESSAGES.KILLED_THE_WUMPUS);
      }
    }
  }

  exit() {
    if (this.hunterY === 0 && this.hunterX === 0) {
      if (this.isWumpusIsDead && this.isGoldFound) {
        this.done = true;
        this.ended = true;
      } else {
        this.tryingToLeave = true;
        this.hunterMoved();
      }
    }
  }

  walk() {
    // this.tryingToLeave = false;

    let wall = false;
    let newY = this.hunterY;
    let newX = this.hunterX;

    switch (this.hunterDirection) {
      case 1:
        newY = this.hunterY + 1;
        if (newY > this.getHeight() - 1) {
          newY = this.hunterY;
          wall = true;
        } else {
          this.steps += 1;
        }
        break;
      case 2:
        newX = this.hunterX - 1;
        if (newX < 0) {
          newX = this.hunterX;
          wall = true;
        } else {
          this.steps += 1;
        }
        break;
      case 3:
        newY = this.hunterY - 1;
        if (newY < 0) {
          newY = this.hunterY;
          wall = true;
        } else {
          this.steps += 1;
        }
        break;
      default:
        newX = this.hunterX + 1;
        if (newX > this.getWidth() - 1) {
          newX = this.hunterX;
          wall = true;
        } else {
          this.steps += 1;
        }
        break;
    }

    this.hunterY = newY;
    this.hunterX = newX;
    this.hunterMoved();
    if (wall) {
      this.perceptions.push(MESSAGES.HIT_THE_WALL);
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

  getHunterY() {
    return this.hunterY;
  }

  getHunterX() {
    return this.hunterX;
  }

  getArrowsInCarcaj() {
    return this.arrowsInCarcaj;
  }

  getPerceptions() {
    return this.perceptions;
  }

  getWumpusIsDead() {
    return this.isWumpusIsDead;
  }

  getGoldFound() {
    return this.isGoldFound;
  }

  getSteps() {
    return this.steps;
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
    return (row === 0 && col === 0) || this.tile(row, col).isVisible;
  }

  getIsGoldPosition(row: number, col: number) {
    const tile = this.tile(row, col);
    return (tile.hasGold && !this.pickedGold) && tile.isVisible;
  }

  getIsPickedGoldPosition(row: number, col: number) {
    const tile = this.tile(row, col);
    return (tile.hasGold && this.pickedGold) && tile.isVisible;
  }

  getIsWumpusPosition(row: number, col: number) {
    const tile = this.tile(row, col);
    return (tile.hasWumpus && !tile.isWumpusDead) && tile.isVisible;
  }

  getIsWumpusDeadPosition(row: number, col: number) {
    const tile = this.tile(row, col);
    return (tile.hasWumpus && this.tile(row, col).isWumpusDead) && tile.isVisible;
  }

  getIsWellPosition(row: number, col: number) {
    const tile = this.tile(row, col);
    return (tile.hasWell) && tile.isVisible;
  }

  getIsHunterPosition(row: number, col: number) {
    return (this.hunterY === row && this.hunterX === col);
  }

  getIsDone() {
    return this.done;
  }
  // #endregion
}
