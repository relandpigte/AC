import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseVideoTemplateComponent } from './choose-video-template.component';

describe('ChooseVideoTemplateComponent', () => {
  let component: ChooseVideoTemplateComponent;
  let fixture: ComponentFixture<ChooseVideoTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseVideoTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseVideoTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
