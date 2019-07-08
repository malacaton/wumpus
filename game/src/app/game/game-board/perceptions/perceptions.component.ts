import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-perceptions',
  templateUrl: './perceptions.component.html',
  styleUrls: ['./perceptions.component.scss']
})
export class PerceptionsComponent implements OnInit {

  @Input() perceptions: string[];
  @Input() ended = false;

  // Events
  @Output() stopGame = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  stopGameButton() {
    this.stopGame.emit();
  }

}
