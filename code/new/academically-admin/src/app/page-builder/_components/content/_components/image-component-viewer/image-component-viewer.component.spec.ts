import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponentViewerComponent } from './image-component-viewer.component';

describe('ImageComponentViewerComponent', () => {
  let component: ImageComponentViewerComponent;
  let fixture: ComponentFixture<ImageComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
