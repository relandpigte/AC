import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEventsBadgeComponent } from './related-events-badge.component';

describe('RelatedEventsBadgeComponent', () => {
  let component: RelatedEventsBadgeComponent;
  let fixture: ComponentFixture<RelatedEventsBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedEventsBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedEventsBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
