import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumBadgeComponent } from './curriculum-badge.component';

describe('CurriculumBadgeComponent', () => {
  let component: CurriculumBadgeComponent;
  let fixture: ComponentFixture<CurriculumBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculumBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
