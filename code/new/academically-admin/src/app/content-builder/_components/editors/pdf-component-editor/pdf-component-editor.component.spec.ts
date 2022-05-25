import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfComponentEditorComponent } from './pdf-component-editor.component';

describe('PdfComponentEditorComponent', () => {
  let component: PdfComponentEditorComponent;
  let fixture: ComponentFixture<PdfComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
