import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingGridComponent } from './teaching-grid.component';

describe('TeachingGridComponent', () => {
  let component: TeachingGridComponent;
  let fixture: ComponentFixture<TeachingGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
