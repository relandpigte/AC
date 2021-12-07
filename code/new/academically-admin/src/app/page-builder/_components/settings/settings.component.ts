import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { CourseSectionType, CourseSectionDto } from '@shared/service-proxies/service-proxies';
import { PageBuilderService } from './../../_services/page-builder.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AppComponentBase implements OnInit {
  model = new CourseSectionDto();
  CourseSectionType = CourseSectionType;
  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._pageBuilderService.courseSection$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(courseSection => {
        this.model = courseSection;
      });
  }
  public prepareContentsForSaving(): CourseSectionDto {
    return this.model;
  }
}
