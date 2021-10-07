import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectionEditorComponent } from './page-section-editor.component';

describe('PageSectionEditorComponent', () => {
  let component: PageSectionEditorComponent;
  let fixture: ComponentFixture<PageSectionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSectionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
