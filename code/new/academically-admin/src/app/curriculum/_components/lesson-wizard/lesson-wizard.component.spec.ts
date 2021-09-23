import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonWizardComponent } from './lesson-wizard.component';

describe('LessonWizardComponent', () => {
  let component: LessonWizardComponent;
  let fixture: ComponentFixture<LessonWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
