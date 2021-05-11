import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorWizardComponent } from './tutor-wizard.component';

describe('TutorWizardComponent', () => {
  let component: TutorWizardComponent;
  let fixture: ComponentFixture<TutorWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
