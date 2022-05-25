import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class ImageComponentContent extends ComponentContent {
  imageDocument: DocumentDto;

  constructor() {
    super();
    this.type = 'image';
    this.name = 'Image';
    this.icon = 'fe fe-image';
    this.description = 'An image width dimensions that be adjusted.';
  }
}
