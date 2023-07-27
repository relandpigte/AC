import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBadgeComponent } from './session-badge.component';

describe('SessionBadgeComponent', () => {
  let component: SessionBadgeComponent;
  let fixture: ComponentFixture<SessionBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
