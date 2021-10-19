import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentEditorComponent } from './page-content-editor.component';

describe('PageContentEditorComponent', () => {
  let component: PageContentEditorComponent;
  let fixture: ComponentFixture<PageContentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageContentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
