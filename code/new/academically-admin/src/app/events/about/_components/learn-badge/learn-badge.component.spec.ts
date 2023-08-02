import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnBadgeComponent } from './learn-badge.component';

describe('LearnBadgeComponent', () => {
  let component: LearnBadgeComponent;
  let fixture: ComponentFixture<LearnBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
