import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIntroductionMetricsComponent } from './profile-introduction-metrics.component';

describe('ProfileIntroductionMetricsComponent', () => {
  let component: ProfileIntroductionMetricsComponent;
  let fixture: ComponentFixture<ProfileIntroductionMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileIntroductionMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIntroductionMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
