import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class AudioComponentContent extends ComponentContent {
  audioDocument: DocumentDto;

  constructor() {
    super();
    this.type = 'audio';
    this.name = 'Audio';
    this.icon = 'fe fe-headphones';
    this.description = 'An audio file.';
  }
}
