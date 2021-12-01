import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalMenuComponent } from './portal-menu.component';

describe('PortalMenuComponent', () => {
  let component: PortalMenuComponent;
  let fixture: ComponentFixture<PortalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
