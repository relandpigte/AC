import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoHostsComponent } from './co-hosts.component';

describe('CoHostsComponent', () => {
  let component: CoHostsComponent;
  let fixture: ComponentFixture<CoHostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoHostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoHostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
