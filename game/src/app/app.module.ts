import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InitialQuestionsComponent } from './game/initial-questions/initial-questions.component';
import { GameComponent } from './game/game.component';
import { GameBoardComponent } from './game/game-board/game-board.component';
import { PropertiesComponent } from './game/game-board/properties/properties.component';
import { PerceptionsComponent } from './game/game-board/perceptions/perceptions.component';

@NgModule({
  declarations: [
    AppComponent,
    InitialQuestionsComponent,
    GameComponent,
    GameBoardComponent,
    PropertiesComponent,
    PerceptionsComponent,
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
