import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComponentSelectorComponent } from './page-component-selector.component';

describe('PageComponentSelectorComponent', () => {
  let component: PageComponentSelectorComponent;
  let fixture: ComponentFixture<PageComponentSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageComponentSelectorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
