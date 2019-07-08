// perceptions.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-perceptions',
  templateUrl: './perceptions.component.html',
  styleUrls: ['./perceptions.component.scss']
})
export class PerceptionsComponent {

  @Input() perceptions: string[];
  @Input() ended = false;

  // Events
  @Output() stopGame = new EventEmitter<any>();

  constructor() { }

  stopGameButton() {
    this.stopGame.emit();
  }

}
