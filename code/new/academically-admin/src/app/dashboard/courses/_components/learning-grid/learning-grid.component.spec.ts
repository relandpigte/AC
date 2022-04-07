import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningGridComponent } from './learning-grid.component';

describe('LearningGridComponent', () => {
  let component: LearningGridComponent;
  let fixture: ComponentFixture<LearningGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
