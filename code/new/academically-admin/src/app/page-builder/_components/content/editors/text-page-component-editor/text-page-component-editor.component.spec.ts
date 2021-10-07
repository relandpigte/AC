import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPageComponentEditorComponent } from './text-page-component-editor.component';

describe('TextPageComponentEditorComponent', () => {
  let component: TextPageComponentEditorComponent;
  let fixture: ComponentFixture<TextPageComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextPageComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
