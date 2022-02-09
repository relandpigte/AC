import { Component, OnInit, Input } from '@angular/core';
import { SubtitleComponentContent } from '../../../_models/subtitle-component-content';

@Component({
  selector: 'app-subtitle-component-editor',
  templateUrl: './subtitle-component-editor.component.html',
  styleUrls: ['./subtitle-component-editor.component.less']
})
export class SubtitleComponentEditorComponent implements OnInit {
  @Input() component: SubtitleComponentContent;

  constructor() { }

  ngOnInit(): void {
  }


  onEditorReady(editor: any): void {
    if (!this.component.text) {
      editor.format('header', 3);
      editor.format('align', 'center');
    }
  }
}
