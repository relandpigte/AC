import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchFieldsTreeComponent } from './research-fields-tree.component';

describe('ResearchFieldsTreeComponent', () => {
  let component: ResearchFieldsTreeComponent;
  let fixture: ComponentFixture<ResearchFieldsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchFieldsTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchFieldsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
