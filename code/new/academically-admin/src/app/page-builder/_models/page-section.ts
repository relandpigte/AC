import { PageComponent } from './page-component';
import { PageContent } from './page-content';
import { MarginType } from './margin-type';
import * as _ from 'lodash';

export class PageSection extends PageContent {
  pageComponents: PageComponent[] = [];

  constructor() {
    super(MarginType.None);
    this.name = 'Section';
    this.pageComponents = [];
  }
}
