import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class DownloadComponentContent extends ComponentContent {
  downloadDocument: DocumentDto;

  constructor() {
    super();
    this.type = 'download';
    this.name = 'Download';
    this.icon = 'fe fe-download-cloud';
    this.description = 'A button with a download link.';
  }
}
