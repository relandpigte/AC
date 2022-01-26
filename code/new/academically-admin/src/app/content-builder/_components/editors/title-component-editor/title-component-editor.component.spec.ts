import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleComponentEditorComponent } from './title-component-editor.component';

describe('TitleComponentEditorComponent', () => {
  let component: TitleComponentEditorComponent;
  let fixture: ComponentFixture<TitleComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
