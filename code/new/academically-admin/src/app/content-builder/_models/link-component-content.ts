import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class LinkComponentContent extends ComponentContent {
  url: string;
  text: string;

  constructor() {
    super();
    this.type = 'link';
    this.name = 'Link';
    this.icon = 'fe fe-external-link';
    this.description = 'A simple link that opens in a new browser tab.';
    this.url = '';
    this.text = '';
  }
}
