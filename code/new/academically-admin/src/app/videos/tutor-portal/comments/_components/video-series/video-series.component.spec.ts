import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSeriesComponent } from './video-series.component';

describe('VideoSeriesComponent', () => {
  let component: VideoSeriesComponent;
  let fixture: ComponentFixture<VideoSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
