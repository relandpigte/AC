import { DocumentDto } from '@shared/service-proxies/service-proxies';
import { ComponentContent } from './component-content';

export class PdfComponentContent extends ComponentContent {
  pdfDocument: DocumentDto;

  constructor() {
    super();
    this.type = 'pdf';
    this.name = 'PDF';
    this.icon = 'fe fe-file';
    this.description = 'A PDF file.';
  }
}
