import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorApplicationsComponent } from './tutor-applications.component';

describe('TutorApplicationsComponent', () => {
  let component: TutorApplicationsComponent;
  let fixture: ComponentFixture<TutorApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
