import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbsCheckComponent } from './dbs-check.component';

describe('DbsCheckComponent', () => {
  let component: DbsCheckComponent;
  let fixture: ComponentFixture<DbsCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbsCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbsCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
