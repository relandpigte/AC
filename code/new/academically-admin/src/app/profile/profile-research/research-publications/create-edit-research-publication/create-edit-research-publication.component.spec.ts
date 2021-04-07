import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditResearchPublicationComponent } from './create-edit-research-publication.component';

describe('CreateEditResearchPublicationComponent', () => {
  let component: CreateEditResearchPublicationComponent;
  let fixture: ComponentFixture<CreateEditResearchPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditResearchPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditResearchPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
