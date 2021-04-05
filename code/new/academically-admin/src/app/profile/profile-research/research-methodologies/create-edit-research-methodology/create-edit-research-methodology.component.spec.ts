import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditResearchMethodologyComponent } from './create-edit-research-methodology.component';

describe('CreateEditResearchMethodologyComponent', () => {
  let component: CreateEditResearchMethodologyComponent;
  let fixture: ComponentFixture<CreateEditResearchMethodologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditResearchMethodologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditResearchMethodologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
