import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseTutorsComponent } from './browse-tutors.component';

describe('BrowseTutorsComponent', () => {
  let component: BrowseTutorsComponent;
  let fixture: ComponentFixture<BrowseTutorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseTutorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseTutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
