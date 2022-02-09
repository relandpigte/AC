import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { LessonContent } from '../../../_models/lesson-content';
import { PageContent } from '../../../_models/page-content';
import { PageBuilderService } from '../../../_services/page-builder.service';

@Component({
  selector: 'app-lesson-viewer',
  templateUrl: './lesson-viewer.component.html',
  styleUrls: ['./lesson-viewer.component.less']
})
export class LessonViewerComponent extends AppComponentBase implements OnInit {
  @Input() lesson: LessonContent;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onPageClick(page: PageContent): void {
    this._pageBuilderService.content = page;
  }
}
