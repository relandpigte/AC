import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsOpenComponent } from './polls-open.component';

describe('PollsOpenComponent', () => {
  let component: PollsOpenComponent;
  let fixture: ComponentFixture<PollsOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
