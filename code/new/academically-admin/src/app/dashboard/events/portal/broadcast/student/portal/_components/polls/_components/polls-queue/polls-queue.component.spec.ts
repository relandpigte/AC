import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsQueueComponent } from './polls-queue.component';

describe('PollsQueueComponent', () => {
  let component: PollsQueueComponent;
  let fixture: ComponentFixture<PollsQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
