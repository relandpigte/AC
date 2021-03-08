import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIntroductionSummaryComponent } from './profile-introduction-summary.component';

describe('ProfileIntroductionSummaryComponent', () => {
  let component: ProfileIntroductionSummaryComponent;
  let fixture: ComponentFixture<ProfileIntroductionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileIntroductionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIntroductionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
