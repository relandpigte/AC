import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeComponentEditorComponent } from './office-component-editor.component';

describe('OfficeComponentEditorComponent', () => {
  let component: OfficeComponentEditorComponent;
  let fixture: ComponentFixture<OfficeComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
