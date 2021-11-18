import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPreviewComponent } from './lesson-preview.component';

describe('LessonPreviewComponent', () => {
  let component: LessonPreviewComponent;
  let fixture: ComponentFixture<LessonPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
