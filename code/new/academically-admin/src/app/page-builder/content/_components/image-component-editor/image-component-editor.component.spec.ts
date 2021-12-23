import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponentEditorComponent } from './image-component-editor.component';

describe('ImageComponentEditorComponent', () => {
  let component: ImageComponentEditorComponent;
  let fixture: ComponentFixture<ImageComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
