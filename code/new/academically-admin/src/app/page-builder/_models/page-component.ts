import { PageContent } from './page-content';
import { MarginType } from './margin-type';

export class PageComponent extends PageContent {
  icon: string;

  constructor(marginType?: MarginType, disableMargins?: boolean) {
    super(marginType);
    this.disableMargins = disableMargins;
    this.setMargins();
  }
}
