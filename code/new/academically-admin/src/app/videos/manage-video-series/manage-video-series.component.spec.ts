import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVideoSeriesComponent } from './manage-video-series.component';

describe('ManageVideoSeriesComponent', () => {
  let component: ManageVideoSeriesComponent;
  let fixture: ComponentFixture<ManageVideoSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVideoSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVideoSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
