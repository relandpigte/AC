import { Content } from './content';
import { PageContent } from './page-content';

export class LessonContent extends Content {
  pages: PageContent[] = [];

  constructor() {
    super();
    this.type = 'lesson';
  }
}
