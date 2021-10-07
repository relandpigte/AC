import { Component, OnInit, Input } from '@angular/core';
import { ImagePageComponent } from '@app/page-builder/_models/image-page-component';

@Component({
  selector: 'app-image-page-component-preview',
  templateUrl: './image-page-component-preview.component.html',
  styleUrls: ['./image-page-component-preview.component.less']
})
export class ImagePageComponentPreviewComponent implements OnInit {
  @Input() pageComponent: ImagePageComponent = new ImagePageComponent();

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
