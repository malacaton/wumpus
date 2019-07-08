import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialQuestionsComponent } from './initial-questions.component';

describe('InitialQuestionsComponent', () => {
  let component: InitialQuestionsComponent;
  let fixture: ComponentFixture<InitialQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
