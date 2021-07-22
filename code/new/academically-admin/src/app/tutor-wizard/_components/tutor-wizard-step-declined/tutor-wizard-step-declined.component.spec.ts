import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorWizardStepDeclinedComponent } from './tutor-wizard-step-declined.component';

describe('TutorWizardStepCommentComponent', () => {
  let component: TutorWizardStepDeclinedComponent;
  let fixture: ComponentFixture<TutorWizardStepDeclinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorWizardStepDeclinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorWizardStepDeclinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
