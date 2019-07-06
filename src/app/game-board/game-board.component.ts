import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameParams } from '../models/game-params';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  // Properties
  @Input() gameParams: GameParams;

  // Events
  @Output() endGame = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  stopGame() {
    this.endGame.emit();
  }
}
