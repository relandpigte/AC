import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleComponentViewerComponent } from './subtitle-component-viewer.component';

describe('SubtitleComponentViewerComponent', () => {
  let component: SubtitleComponentViewerComponent;
  let fixture: ComponentFixture<SubtitleComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtitleComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitleComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
