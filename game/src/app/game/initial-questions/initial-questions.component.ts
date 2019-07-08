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
  wellsCount: number;
  arrowsCount: number;

  // Events
  @Output() playGame = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.restartBoard();
  }

  restartBoard() {
    this.boardWidth = 4;
    this.totalCells = this.boardWidth * this.boardWidth;
    this.wellsCount = 1;
    this.arrowsCount = 3;
  }

  onBoardWithChange() {
    this.totalCells = this.boardWidth * this.boardWidth;
    this.onWellsCountChange();
  }

  onWellsCountChange() {
    if (this.wellsCount < 0) {
      this.wellsCount = 0;
    } else if (this.wellsCount > (this.totalCells - 3)) {
      this.wellsCount = this.totalCells - 3;
    }
  }

  startGame() {
    this.playGame.emit({boardWidth: this.boardWidth, wellsCount: this.wellsCount, arrowsCount: this.arrowsCount});
  }
}
