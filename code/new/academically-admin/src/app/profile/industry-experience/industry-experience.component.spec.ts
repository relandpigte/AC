import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryExperienceComponent } from './industry-experience.component';

describe('IndustryExperienceComponent', () => {
  let component: IndustryExperienceComponent;
  let fixture: ComponentFixture<IndustryExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
