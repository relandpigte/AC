import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyTextComponentViewerComponent } from './body-text-component-viewer.component';

describe('BodyTextComponentViewerComponent', () => {
  let component: BodyTextComponentViewerComponent;
  let fixture: ComponentFixture<BodyTextComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyTextComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyTextComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
