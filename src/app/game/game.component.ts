import { Component, OnInit, Input } from '@angular/core';
import { GameParams } from '../models/game-params';
import { Tile } from '../models/tile';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  // Properties
  gameParams = new GameParams();

  @Input() isPlaying = false;

  constructor() { }

  ngOnInit() {
  }

  playGame(params: any) {
    console.log('play 2:', params.boardWidth, params.pitsCount, params.arrowsCount);
    this.isPlaying = true;

    this.gameParams.width = params.boardWidth;
    this.gameParams.height = params.boardWidth;
    this.gameParams.arrowsCount = params.arrowsCount;
    this.gameParams.pitsCount = params.pitsCount;

    this.gameParams.board = new Array(this.gameParams.width);
    for (let i = 0; i < this.gameParams.width; i++) {
      this.gameParams.board[i] = new Array(this.gameParams.height);

      for (let z = 0; z < this.gameParams.height; z++) {
        this.gameParams.board[i][z] = new Tile();
      }
    }

    this.gameParams.hunterX = 0;
    this.gameParams.hunterY = 0;

    // this.gameParams.board[1][2].hasWumpus = true;

    console.log(this.gameParams);

    // console.log('0,3:', this.gameParams.board[0][3].hasWumpus);
    // console.log('1,2:', this.gameParams.board[1][2].hasWumpus);
    // console.log('2,2:', this.gameParams.board[2][2].hasWumpus);
  }

  endGame() {
    this.isPlaying = false;
  }
}
