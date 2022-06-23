import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingsComponent } from './coachings.component';

describe('CoachingsComponent', () => {
  let component: CoachingsComponent;
  let fixture: ComponentFixture<CoachingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
