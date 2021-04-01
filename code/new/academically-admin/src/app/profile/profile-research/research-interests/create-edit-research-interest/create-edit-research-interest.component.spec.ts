import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditResearchInterestComponent } from './create-edit-research-interest.component';

describe('CreateEditResearchInterestComponent', () => {
  let component: CreateEditResearchInterestComponent;
  let fixture: ComponentFixture<CreateEditResearchInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditResearchInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditResearchInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
