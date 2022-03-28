import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoHostComponent } from './co-host.component';

describe('CoHostComponent', () => {
  let component: CoHostComponent;
  let fixture: ComponentFixture<CoHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
