import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.less']
})
export class TemplateComponent extends AppComponentBase implements OnInit {
  @Output() modalClose = new EventEmitter();
  @Output() selectTemplate = new EventEmitter();
  isTemplateSelected = false;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onTemplateSelected(): void {
    this.isTemplateSelected = !this.isTemplateSelected;
  }

  onCancelClick(): void {
    this.modalClose.emit();
  }

  onNextClick(): void {
    this.selectTemplate.emit();
  }
}
