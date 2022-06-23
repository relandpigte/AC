import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationMaterialsComponent } from './presentation-materials.component';

describe('PresentationMaterialsComponent', () => {
  let component: PresentationMaterialsComponent;
  let fixture: ComponentFixture<PresentationMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
