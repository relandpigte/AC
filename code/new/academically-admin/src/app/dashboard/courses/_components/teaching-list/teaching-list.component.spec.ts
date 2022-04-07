import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingListComponent } from './teaching-list.component';

describe('TeachingListComponent', () => {
  let component: TeachingListComponent;
  let fixture: ComponentFixture<TeachingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
