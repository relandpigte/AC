import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleComponentViewerComponent } from './title-component-viewer.component';

describe('TitleComponentViewerComponent', () => {
  let component: TitleComponentViewerComponent;
  let fixture: ComponentFixture<TitleComponentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleComponentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleComponentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
