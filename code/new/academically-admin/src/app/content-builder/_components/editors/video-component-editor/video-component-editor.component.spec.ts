import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoComponentEditorComponent } from './video-component-editor.component';

describe('VideoComponentEditorComponent', () => {
  let component: VideoComponentEditorComponent;
  let fixture: ComponentFixture<VideoComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
