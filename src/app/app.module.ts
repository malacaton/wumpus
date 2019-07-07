import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { InitialQuestionsComponent } from './initial-questions/initial-questions.component';
import { GameComponent } from './game/game.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { PropertiesComponent } from './properties/properties.component';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    InitialQuestionsComponent,
    GameComponent,
    GameBoardComponent,
    PropertiesComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
