import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioComponentViewerComponent } from './audio-component-viewer.component';

describe('AudioComponentViewerComponent', () => {
  let component: AudioComponentViewerComponent;
  let fixture: ComponentFixture<AudioComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
