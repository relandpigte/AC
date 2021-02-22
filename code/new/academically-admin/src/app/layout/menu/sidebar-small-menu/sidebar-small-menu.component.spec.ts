import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSmallMenuComponent } from './sidebar-small-menu.component';

describe('SidebarSmallMenuComponent', () => {
  let component: SidebarSmallMenuComponent;
  let fixture: ComponentFixture<SidebarSmallMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarSmallMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSmallMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
