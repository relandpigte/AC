import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorWizardStepComponent } from './tutor-wizard-step.component';

describe('TutorWizardStepComponent', () => {
  let component: TutorWizardStepComponent;
  let fixture: ComponentFixture<TutorWizardStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorWizardStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorWizardStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
