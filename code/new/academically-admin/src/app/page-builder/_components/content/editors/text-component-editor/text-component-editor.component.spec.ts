import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextComponentEditorComponent } from './text-component-editor.component';

describe('TextComponentEditorComponent', () => {
  let component: TextComponentEditorComponent;
  let fixture: ComponentFixture<TextComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
