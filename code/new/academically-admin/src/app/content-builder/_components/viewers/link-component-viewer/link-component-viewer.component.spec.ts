import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponentViewerComponent } from './link-component-viewer.component';

describe('LinkComponentViewerComponent', () => {
  let component: LinkComponentViewerComponent;
  let fixture: ComponentFixture<LinkComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
