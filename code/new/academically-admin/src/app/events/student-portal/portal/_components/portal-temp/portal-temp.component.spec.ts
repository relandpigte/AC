import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalTempComponent } from './portal-temp.component';

describe('PortalTempComponent', () => {
  let component: PortalTempComponent;
  let fixture: ComponentFixture<PortalTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
