import { MarginType } from './margin-type';
import { ComponentContent } from './component-content';

export class ImageComponentContent extends ComponentContent {
  base64image: string;
  imageName: string;
  imageSize: number;

  constructor() {
    super();
    this.name = 'Image';
    this.icon = 'fe fe-image';
    this.marginType = MarginType.Normal;
    this.setMargins();
  }
}
