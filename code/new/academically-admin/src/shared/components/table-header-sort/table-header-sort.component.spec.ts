import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderSortComponent } from './table-header-sort.component';

describe('TableHeaderSortComponent', () => {
  let component: TableHeaderSortComponent;
  let fixture: ComponentFixture<TableHeaderSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHeaderSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHeaderSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
