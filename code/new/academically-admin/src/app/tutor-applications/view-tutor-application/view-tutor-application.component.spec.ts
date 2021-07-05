import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTutorApplicationComponent } from './view-tutor-application.component';

describe('ViewTutorApplicationComponent', () => {
  let component: ViewTutorApplicationComponent;
  let fixture: ComponentFixture<ViewTutorApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTutorApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTutorApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
