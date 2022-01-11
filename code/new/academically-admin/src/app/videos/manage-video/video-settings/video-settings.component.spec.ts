import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSettingsComponent } from './video-settings.component';

describe('VideoSettingsComponent', () => {
  let component: VideoSettingsComponent;
  let fixture: ComponentFixture<VideoSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
