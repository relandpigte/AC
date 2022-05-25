import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponentEditorComponent } from './link-component-editor.component';

describe('LinkComponentEditorComponent', () => {
  let component: LinkComponentEditorComponent;
  let fixture: ComponentFixture<LinkComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
