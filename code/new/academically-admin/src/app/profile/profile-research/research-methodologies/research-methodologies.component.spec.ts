import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchMethodologiesComponent } from './research-methodologies.component';

describe('ResearchMethodologiesComponent', () => {
  let component: ResearchMethodologiesComponent;
  let fixture: ComponentFixture<ResearchMethodologiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchMethodologiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchMethodologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
