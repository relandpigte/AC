import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeComponentViewerComponent } from './office-component-viewer.component';

describe('OfficeComponentViewerComponent', () => {
  let component: OfficeComponentViewerComponent;
  let fixture: ComponentFixture<OfficeComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
