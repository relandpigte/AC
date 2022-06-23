import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePresenterComponent } from './invite-presenter.component';

describe('InvitePresenterComponent', () => {
  let component: InvitePresenterComponent;
  let fixture: ComponentFixture<InvitePresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
