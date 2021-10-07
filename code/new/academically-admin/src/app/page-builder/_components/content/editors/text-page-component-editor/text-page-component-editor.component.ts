import { Component, OnInit, Input } from '@angular/core';
import { TextPageComponent } from '@app/page-builder/_models/text-page-component';

@Component({
  selector: 'app-text-page-component-editor',
  templateUrl: './text-page-component-editor.component.html',
  styleUrls: ['./text-page-component-editor.component.less']
})
export class TextPageComponentEditorComponent implements OnInit {
  @Input() pageComponent: TextPageComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
