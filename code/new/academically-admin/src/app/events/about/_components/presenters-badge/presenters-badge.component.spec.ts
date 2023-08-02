import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentersBadgeComponent } from './presenters-badge.component';

describe('PresentersBadgeComponent', () => {
  let component: PresentersBadgeComponent;
  let fixture: ComponentFixture<PresentersBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentersBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentersBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
