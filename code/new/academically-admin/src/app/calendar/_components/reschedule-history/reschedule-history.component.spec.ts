import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleHistoryComponent } from './reschedule-history.component';

describe('RescheduleHistoryComponent', () => {
  let component: RescheduleHistoryComponent;
  let fixture: ComponentFixture<RescheduleHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescheduleHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
