import { AngularSelector } from 'testcafe-angular-selectors';

export class GameBoardProperties {
  constructor () {
    const properties = AngularSelector('app-properties');

    this.panelWidth = properties.find('#panel-height');
    this.panelWidth = properties.find('#panel-width');
    this.arrowsInCarcaj = properties.find('#arrows-in-carcaj');
    this.currentRow = properties.find('#current-row');
    this.currentCol = properties.find('#current-col');
    this.NumberOfSteps = properties.find('#number-of-steps');
  }
}