import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePageComponentPreviewComponent } from './image-page-component-preview.component';

describe('ImagePageComponentPreviewComponent', () => {
  let component: ImagePageComponentPreviewComponent;
  let fixture: ComponentFixture<ImagePageComponentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePageComponentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePageComponentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
