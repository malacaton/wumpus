import { AngularSelector } from 'testcafe-angular-selectors';

export class GameBoardProperties {
  constructor () {
    const properties = AngularSelector('app-properties');

    this.heightWidth = properties.find('#panel-height');
    this.panelWidth = properties.find('#panel-width');
    this.arrowsInCarcaj = properties.find('#arrows-in-carcaj');
    this.currentRow = properties.find('#current-row');
    this.currentCol = properties.find('#current-col');
    this.NumberOfSteps = properties.find('#number-of-steps');
  }
};

// export class GameBoard {
//   constructor () {
//     const gameBoard = AngularSelector('app-game-board');

//     this.heightWidth = gameBoard.find('#height-width');
//     this.wellsCount = gameBoard.find('#wells-count');
//     this.arrowsCount = gameBoard.find('#arrows-count');
//     this.startButton = gameBoard.find('#start-game-button');
//   }
// };
