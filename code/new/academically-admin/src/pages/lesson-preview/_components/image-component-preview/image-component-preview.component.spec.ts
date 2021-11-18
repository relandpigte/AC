import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponentPreviewComponent } from './image-component-preview.component';

describe('ImageComponentPreviewComponent', () => {
  let component: ImageComponentPreviewComponent;
  let fixture: ComponentFixture<ImageComponentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageComponentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
