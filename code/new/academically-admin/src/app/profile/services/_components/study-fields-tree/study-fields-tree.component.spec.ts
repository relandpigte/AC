import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyFieldsTreeComponent } from './study-fields-tree.component';

describe('StudyFieldsTreeComponent', () => {
  let component: StudyFieldsTreeComponent;
  let fixture: ComponentFixture<StudyFieldsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyFieldsTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyFieldsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
