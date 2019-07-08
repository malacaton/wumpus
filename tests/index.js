import { waitForAngular } from 'testcafe-angular-selectors';
import { StartGame } from './start-game.js';

const startPage = new StartGame();

fixture `Wumpus test`
  .page('http://localhost:4200/')
  .beforeEach(async t => {
    await waitForAngular();
  });

  test('Start game', async t => {
    await t
      .typeText(startPage.heightWidth, '5', { replace: true })
      .typeText(startPage.wellsCount, '2', { replace: true })
      .typeText(startPage.arrowsCount, '4', { replace: true })
      .click(startPage.startButton);
  });
  