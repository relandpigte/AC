import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQualificationDocumentsComponent } from './view-qualification-documents.component';

describe('ViewQualificationDocumentsComponent', () => {
  let component: ViewQualificationDocumentsComponent;
  let fixture: ComponentFixture<ViewQualificationDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQualificationDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQualificationDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
