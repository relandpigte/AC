import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningListComponent } from './learning-list.component';

describe('LearningListComponent', () => {
  let component: LearningListComponent;
  let fixture: ComponentFixture<LearningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
