import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTutorProposalComponent } from './view-tutor-proposal.component';

describe('ViewTutorProposalComponent', () => {
  let component: ViewTutorProposalComponent;
  let fixture: ComponentFixture<ViewTutorProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTutorProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTutorProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
