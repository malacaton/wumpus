import { waitForAngular } from 'testcafe-angular-selectors';
import { Selector } from 'testcafe';

import { StartGame } from './start-game';

const startPage = new StartGame();

fixture `Wumpus test`
.page('http://localhost:4200/')
.beforeEach(async t => {
  await waitForAngular();
});

test('Start game and check parameters', async t => {
  await t
    .typeText(startPage.heightWidth, '5', { replace: true })
    .typeText(startPage.arrowsCount, '4', { replace: true })
    .click(startPage.startButton)
    .expect(Selector('#panel-height').innerText).contains('5')
    .expect(Selector('#panel-width').innerText).contains('5')
    .expect(Selector('#arrows-in-carcaj').innerText).contains('4')
});

test('Check game actions', async t => {
  await t
    .click(startPage.startButton)
    .expect(Selector('#panel-height').innerText).contains('4')

    .typeText(Selector('#action'), 'L', { replace: true }) // Rotar a la izquierda (se queda mirando arriba)
    .click(Selector('#sendAction'))

    .typeText(Selector('#action'), 'F', { replace: true }) // Dispara una flecha contra el muro
    .click(Selector('#sendAction'))
    .expect(Selector('.perception').innerText).contains('¡CLONK!')

    .typeText(Selector('#action'), 'R', { replace: true }) // Rotar a la derecha (se queda como al iniio)
    .click(Selector('#sendAction'))

    .typeText(Selector('#action'), 'W', { replace: true }) // Avanza
    .click(Selector('#sendAction'))
    .expect(Selector('#current-col').innerText).eql('2')
});
