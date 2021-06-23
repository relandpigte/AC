import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProposalsComponent } from './project-proposals.component';

describe('ProjectDetailsComponent', () => {
  let component: ProjectProposalsComponent;
  let fixture: ComponentFixture<ProjectProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProposalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
