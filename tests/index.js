import { waitForAngular } from 'testcafe-angular-selectors';
import { Selector } from 'testcafe';

import { StartGame } from './start-game';
import { GameBoardProperties } from './game-board-properties';

const startPage = new StartGame();
const gameBoardProperties = new GameBoardProperties();

fixture `Wumpus test`
  .page('http://localhost:4200/')
  .beforeEach(async t => {
    await waitForAngular();
  });

  test('Start game and check properties', async t => {
    const startPoint = Selector('.zone');
      
    await t
      .typeText(startPage.heightWidth, '5', { replace: true })
      .typeText(startPage.wellsCount, '2', { replace: true })
      .typeText(startPage.arrowsCount, '4', { replace: true })
      .click(startPage.startButton)
      .expect(Selector('#panel-height').innerText).contains('5')
      .expect(Selector('#panel-width').innerText).contains('5')
      .expect(Selector('#arrows-in-carcaj').innerText).contains('4')
  });
  
  test('Check properties', async t => {
    await t
      .click(startPage.startButton)
      .expect(Selector('#panel-height').innerText).contains('4')
      .click(Selector('#start-game-button'))
      .pressKey('up')
      // .pressKey('enter')
      // .pressKey('right')
      // .pressKey('left')
      // .pressKey('space');
    });
