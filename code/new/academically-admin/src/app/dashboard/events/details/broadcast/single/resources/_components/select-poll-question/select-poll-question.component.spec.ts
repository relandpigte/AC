import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPollQuestionComponent } from './select-poll-question.component';

describe('SelectPollQuestionComponent', () => {
  let component: SelectPollQuestionComponent;
  let fixture: ComponentFixture<SelectPollQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPollQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPollQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
