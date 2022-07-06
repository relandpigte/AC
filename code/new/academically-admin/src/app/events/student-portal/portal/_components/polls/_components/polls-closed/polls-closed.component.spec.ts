import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsClosedComponent } from './polls-closed.component';

describe('PollsClosedComponent', () => {
  let component: PollsClosedComponent;
  let fixture: ComponentFixture<PollsClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
