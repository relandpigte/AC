import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePresenterByEmailComponent } from './invite-presenter-by-email.component';

describe('InvitePresenterByEmailComponent', () => {
  let component: InvitePresenterByEmailComponent;
  let fixture: ComponentFixture<InvitePresenterByEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePresenterByEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePresenterByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
