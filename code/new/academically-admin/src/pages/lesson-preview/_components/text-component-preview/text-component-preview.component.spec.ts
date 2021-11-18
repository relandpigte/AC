import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextComponentPreviewComponent } from './text-component-preview.component';

describe('TextComponentPreviewComponent', () => {
  let component: TextComponentPreviewComponent;
  let fixture: ComponentFixture<TextComponentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextComponentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
