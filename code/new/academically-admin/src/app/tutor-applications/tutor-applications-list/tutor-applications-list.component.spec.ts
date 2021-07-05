import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorApplicationsListComponent } from './tutor-applications-list.component';

describe('TutorApplicationsListComponent', () => {
  let component: TutorApplicationsListComponent;
  let fixture: ComponentFixture<TutorApplicationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorApplicationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
