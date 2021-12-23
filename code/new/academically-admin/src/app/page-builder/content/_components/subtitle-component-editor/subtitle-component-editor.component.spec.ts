import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleComponentEditorComponent } from './subtitle-component-editor.component';

describe('SubtitleComponentEditorComponent', () => {
  let component: SubtitleComponentEditorComponent;
  let fixture: ComponentFixture<SubtitleComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtitleComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitleComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
