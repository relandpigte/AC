import { Component, OnInit, Input } from '@angular/core';
import { TitleComponentContent } from '../../../_models/title-component-content';

@Component({
  selector: 'app-title-component-editor',
  templateUrl: './title-component-editor.component.html',
  styleUrls: ['./title-component-editor.component.less']
})
export class TitleComponentEditorComponent implements OnInit {
  @Input() component: TitleComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

  onEditorReady(editor: any): void {
    if (!this.component.text) {
      editor.format('header', 1);
      editor.format('align', 'center');
    }
  }
}
