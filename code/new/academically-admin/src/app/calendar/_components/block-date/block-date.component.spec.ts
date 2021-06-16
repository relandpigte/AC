import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockDateComponent } from './block-date.component';

describe('BlockDateComponent', () => {
  let component: BlockDateComponent;
  let fixture: ComponentFixture<BlockDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
