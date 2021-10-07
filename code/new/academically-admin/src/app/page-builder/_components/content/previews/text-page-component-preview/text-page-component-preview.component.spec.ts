import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPageComponentPreviewComponent } from './text-page-component-preview.component';

describe('TextPageComponentPreviewComponent', () => {
  let component: TextPageComponentPreviewComponent;
  let fixture: ComponentFixture<TextPageComponentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextPageComponentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageComponentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
