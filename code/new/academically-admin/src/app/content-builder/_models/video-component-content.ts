import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class VideoComponentContent extends ComponentContent {
  videoDocument: DocumentDto;
  isUrl: boolean;
  videoUrl: string;

  constructor() {
    super();
    this.type = 'video';
    this.name = 'Video';
    this.icon = 'fe fe-file';
    this.description = 'A video from a file or a url.';
  }
}
