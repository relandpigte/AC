import { Component, OnInit, Input } from '@angular/core';
import { TextPageComponent } from '@app/page-builder/_models/text-page-component';

@Component({
  selector: 'app-text-page-component-preview',
  templateUrl: './text-page-component-preview.component.html',
  styleUrls: ['./text-page-component-preview.component.less']
})
export class TextPageComponentPreviewComponent implements OnInit {
  @Input() pageComponent: TextPageComponent = new TextPageComponent();

  constructor() { }

  ngOnInit(): void {
  }

}
