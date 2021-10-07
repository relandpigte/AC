import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePageComponentEditorComponent } from './image-page-component-editor.component';

describe('ImagePageComponentEditorComponent', () => {
  let component: ImagePageComponentEditorComponent;
  let fixture: ComponentFixture<ImagePageComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePageComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePageComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
