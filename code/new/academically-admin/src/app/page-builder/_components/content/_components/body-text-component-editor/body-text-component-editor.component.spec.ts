import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyTextComponentEditorComponent } from './body-text-component-editor.component';

describe('BodyTextComponentEditorComponent', () => {
  let component: BodyTextComponentEditorComponent;
  let fixture: ComponentFixture<BodyTextComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyTextComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyTextComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
