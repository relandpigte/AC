import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionGraphComponent } from './conversion-graph.component';

describe('ConversionGraphComponent', () => {
  let component: ConversionGraphComponent;
  let fixture: ComponentFixture<ConversionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
