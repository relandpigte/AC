import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachBadgeComponent } from './coach-badge.component';

describe('AboutCoachComponent', () => {
  let component: CoachBadgeComponent;
  let fixture: ComponentFixture<CoachBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
