import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  @Input() height: number;
  @Input() width: number;
  @Input() arrowsInCarcaj: number;
  @Input() hunterY = 0;
  @Input() hunterX = 0;
  @Input() steps: number;
  @Input() isGoldFound = false;
  @Input() isWumpusIsDead = false;

  constructor() { }

  ngOnInit() {
  }

}
