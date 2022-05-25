import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfComponentViewerComponent } from './pdf-component-viewer.component';

describe('PdfComponentViewerComponent', () => {
  let component: PdfComponentViewerComponent;
  let fixture: ComponentFixture<PdfComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
