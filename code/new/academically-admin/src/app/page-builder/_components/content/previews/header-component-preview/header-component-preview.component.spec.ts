import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponentPreviewComponent } from './header-component-preview.component';

describe('HeaderComponentPreviewComponent', () => {
  let component: HeaderComponentPreviewComponent;
  let fixture: ComponentFixture<HeaderComponentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
