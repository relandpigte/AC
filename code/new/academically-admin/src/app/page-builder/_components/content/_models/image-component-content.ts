import { ComponentContent } from './component-content';

export class ImageComponentContent extends ComponentContent {
  base64image: string;
  imageName: string;
  imageSize: number;

  constructor() {
    super();
    this.type = 'image';
    this.name = 'Image';
    this.icon = 'fe fe-image';
    this.description = 'An image width dimensions that be adjusted.';
  }
}
