import { Component, Input, OnInit } from '@angular/core';
import { ImageComponentContent } from '../../../../_models/image-component-content';

@Component({
  selector: 'app-image-component-preview',
  templateUrl: './image-component-preview.component.html',
  styleUrls: ['./image-component-preview.component.less']
})
export class ImageComponentPreviewComponent implements OnInit {
  @Input() content: ImageComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
