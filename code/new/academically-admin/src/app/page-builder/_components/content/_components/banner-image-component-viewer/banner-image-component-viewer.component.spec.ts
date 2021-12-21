import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerImageComponentViewerComponent } from './banner-image-component-viewer.component';

describe('BannerImageComponentViewerComponent', () => {
  let component: BannerImageComponentViewerComponent;
  let fixture: ComponentFixture<BannerImageComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerImageComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerImageComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
