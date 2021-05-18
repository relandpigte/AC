import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureChangerComponent } from './profile-picture-changer.component';

describe('ProfilePictureChangerComponent', () => {
  let component: ProfilePictureChangerComponent;
  let fixture: ComponentFixture<ProfilePictureChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePictureChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePictureChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
