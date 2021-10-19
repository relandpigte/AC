import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentPreviewComponent } from './page-content-preview.component';

describe('PageContentPreviewComponent', () => {
  let component: PageContentPreviewComponent;
  let fixture: ComponentFixture<PageContentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageContentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
