import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResearchComponent } from './profile-research.component';

describe('ProfileResearchComponent', () => {
  let component: ProfileResearchComponent;
  let fixture: ComponentFixture<ProfileResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
