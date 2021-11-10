import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Content } from '@app/page-builder/_models/content';
import { MarginType } from '@app/page-builder/_models/margin-type';

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.less']
})
export class ContentEditorComponent implements OnInit {
  @Input() content: Content;
  @Output() deleteContent = new EventEmitter<Content>();
  @Output() selectParent = new EventEmitter<Content>();
  MarginType = MarginType;

  constructor() { }

  ngOnInit(): void {
  }

  onMarginTypeChange(): void {
    this.content.setMargins();
  }

  onContentDelete(): void {
    this.deleteContent.emit(this.content);
  }

  onSelectParentClick(): void {
    this.selectParent.emit(this.content);
  }
}
