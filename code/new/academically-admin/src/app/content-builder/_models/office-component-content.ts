import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class OfficeComponentContent extends ComponentContent {
  officeDocument: DocumentDto;

  constructor() {
    super();
    this.type = 'office';
    this.name = 'Office';
    this.icon = 'fe fe-file-text';
    this.description = 'A microsoft office document.';
  }
}
