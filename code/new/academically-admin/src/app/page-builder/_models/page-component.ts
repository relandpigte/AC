import { PageContent } from './page-content';
import { MarginType } from './margin-type';

export class PageComponent extends PageContent {
  icon: string;

  constructor() {
    super(MarginType.Normal);
    this.setMargins();
  }
}
