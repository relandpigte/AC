import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionStudentsFullComponent } from './section-students-full.component';

describe('SectionStudentsFullComponent', () => {
  let component: SectionStudentsFullComponent;
  let fixture: ComponentFixture<SectionStudentsFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionStudentsFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionStudentsFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
