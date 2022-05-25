import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioComponentEditorComponent } from './audio-component-editor.component';

describe('AudioComponentEditorComponent', () => {
  let component: AudioComponentEditorComponent;
  let fixture: ComponentFixture<AudioComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
