import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoComponentViewerComponent } from './video-component-viewer.component';

describe('VideoComponentViewerComponent', () => {
  let component: VideoComponentViewerComponent;
  let fixture: ComponentFixture<VideoComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
