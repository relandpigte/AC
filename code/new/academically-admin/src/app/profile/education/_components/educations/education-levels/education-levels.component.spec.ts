import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationLevelsComponent } from './education-levels.component';

describe('EducationLevelsComponent', () => {
  let component: EducationLevelsComponent;
  let fixture: ComponentFixture<EducationLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
