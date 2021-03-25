import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEducationDocumentsComponent } from './view-education-documents.component';

describe('ViewEducationDocumentsComponent', () => {
  let component: ViewEducationDocumentsComponent;
  let fixture: ComponentFixture<ViewEducationDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEducationDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEducationDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
