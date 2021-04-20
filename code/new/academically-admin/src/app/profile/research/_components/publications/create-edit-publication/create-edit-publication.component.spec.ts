import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPublicationComponent } from './create-edit-publication.component';

describe('CreateEditPublicationComponent', () => {
  let component: CreateEditPublicationComponent;
  let fixture: ComponentFixture<CreateEditPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
