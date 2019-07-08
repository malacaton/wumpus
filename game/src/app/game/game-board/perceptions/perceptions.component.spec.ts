import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerceptionsComponent } from './perceptions.component';

describe('PerceptionsComponent', () => {
  let component: PerceptionsComponent;
  let fixture: ComponentFixture<PerceptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerceptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
