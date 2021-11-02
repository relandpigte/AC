import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPreviewComponent } from './notifications-preview.component';

describe('NotificationsPreviewComponent', () => {
  let component: NotificationsPreviewComponent;
  let fixture: ComponentFixture<NotificationsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
