import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectionPreviewComponent } from './page-section-preview.component';

describe('PageSectionPreviewComponent', () => {
  let component: PageSectionPreviewComponent;
  let fixture: ComponentFixture<PageSectionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSectionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
