import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchMethodTreeComponent } from './research-method-tree.component';

describe('ResearchMethodTreeComponent', () => {
  let component: ResearchMethodTreeComponent;
  let fixture: ComponentFixture<ResearchMethodTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchMethodTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchMethodTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
