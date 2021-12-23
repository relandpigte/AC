import { Component, OnInit, Input } from '@angular/core';
import { SubtitleComponentContent } from '../../_models/subtitle-component-content';

@Component({
  selector: 'app-subtitle-component-viewer',
  templateUrl: './subtitle-component-viewer.component.html',
  styleUrls: ['./subtitle-component-viewer.component.less']
})
export class SubtitleComponentViewerComponent implements OnInit {
  @Input() component: SubtitleComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
