import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponentEditorComponent } from './header-component-editor.component';

describe('HeaderComponentEditorComponent', () => {
  let component: HeaderComponentEditorComponent;
  let fixture: ComponentFixture<HeaderComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
