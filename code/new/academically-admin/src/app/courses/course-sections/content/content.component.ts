import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ContentBuilderComponent } from '@app/content-builder/content-builder.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { CourseSectionService } from '../_services/course-section.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase implements OnInit {
  id: string;
  @ViewChild('contentBuilder') contentBuilder: ContentBuilderComponent;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _contentsService: ContentsServiceProxy,
    private _courseSectionService: CourseSectionService,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-section-id')) {
        this.id = paramMap.get('course-section-id');
        this.getContent();
      }
    });
    this._courseSectionService.courseSectionSave$.subscribe(response => {
      if (response) {
        const content = this.contentBuilder.prepareContentsForSaving(this.id);
        this._contentsService.save(content)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
          });
      }
    });
  }

  ngOnInit(): void {
  }

  private getContent(): void {
    this._contentsService.get(this.id)
      .subscribe(response => {
        this.contentBuilder.pageContent = response;
        this.contentBuilder.initializeContentManager();
      });
  }
}
