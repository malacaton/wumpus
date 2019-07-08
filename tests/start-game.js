import { AngularSelector } from 'testcafe-angular-selectors';

export class StartGame {
  constructor () {
    const initialQuestions = AngularSelector('app-initial-questions');

    this.heightWidth = initialQuestions.find('#height-width');
    this.wellsCount = initialQuestions.find('#wells-count');
    this.arrowsCount = initialQuestions.find('#arrows-count');
    this.startButton = initialQuestions.find('#start-game-button');
  }
};
