import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadComponentViewerComponent } from './download-component-viewer.component';

describe('DownloadComponentViewerComponent', () => {
  let component: DownloadComponentViewerComponent;
  let fixture: ComponentFixture<DownloadComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
