import { Component, OnInit, Input, Output } from '@angular/core';
import { Tile } from '../models/Tile';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  // External properties
  boardWidth = 4;
  pitsCount = 3;
  arrowsCount = 3;

  // Properties
  board: any;
  hunterX: number;
  hunterY: number;

  @Input() isPlaying = false;

  constructor() { }

  ngOnInit() {
  }

  playGame(params: any) {
    console.log('play 2:', params.boardWidth, params.pitsCount, params.arrowsCount);
    this.boardWidth = params.boardWidth;
    this.pitsCount = params.pitsCount;
    this.arrowsCount = params.arrowsCount;
    this.isPlaying = true;

    this.board = new Array(this.boardWidth);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(this.boardWidth);

      for (let z = 0; z < this.board.length; z++) {
        this.board[i][z] = new Tile();
      }
    }

    this.hunterX = 0;
    this.hunterY = 0;


    this.board[1][2].hasWumpus = true;

    console.log('0,3:', this.board[0][3].hasWumpus);
    console.log('1,2:', this.board[1][2].hasWumpus);
    console.log('2,2:', this.board[2][2].hasWumpus);
  }
}
