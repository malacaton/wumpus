import { waitForAngular } from 'testcafe-angular-selectors';
import { StartGame } from './start-game';
import { GameBoardProperties } from './game-board';

const startPage = new StartGame();
const gameBoardProperties = new GameBoardProperties();

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

    await t
      .expect(gameBoardProperties.heightWidth).eql('5');
  });
  