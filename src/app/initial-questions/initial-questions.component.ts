import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-initial-questions',
  templateUrl: './initial-questions.component.html',
  styleUrls: ['./initial-questions.component.scss']
})
export class InitialQuestionsComponent implements OnInit {
  // Properties
  boardWidth: number;
  totalCells: number;
  pitsCount: number;
  arrowsCount: number;

  // Events
  @Output() playGame = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.restartBoard();
  }

  restartBoard() {
    this.boardWidth = 10;
    this.totalCells = this.boardWidth * this.boardWidth;
    this.pitsCount = 10;
    this.arrowsCount = 3;
  }

  onBoardWithChange() {
    this.totalCells = this.boardWidth * this.boardWidth;
  }

  onPitsCountChange() {
    if (this.pitsCount < 0) {
      this.pitsCount = 0;
    } else if (this.pitsCount > (this.totalCells - 3)) {
      this.pitsCount = this.totalCells - 3;
    }
  }

  startGame() {
    // console.log('this.boardWidth:', this.boardWidth);
    // console.log('play 1');
    this.playGame.emit({boardWidth: this.boardWidth, pitsCount: this.pitsCount, arrowsCount: this.arrowsCount});
    // console.log('play 3');
  }
}
