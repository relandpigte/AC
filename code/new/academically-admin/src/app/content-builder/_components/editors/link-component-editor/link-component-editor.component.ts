import { Component, OnInit, Input } from '@angular/core';
import { LinkComponentContent } from '@app/content-builder/_models/link-component-content';

@Component({
  selector: 'app-link-component-editor',
  templateUrl: './link-component-editor.component.html',
  styleUrls: ['./link-component-editor.component.less']
})
export class LinkComponentEditorComponent implements OnInit {
  @Input() component: LinkComponentContent;

  constructor() { }

  ngOnInit(): void {
  }
}
