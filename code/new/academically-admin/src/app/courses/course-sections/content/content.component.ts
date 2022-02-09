import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentBuilderComponent } from '@app/content-builder/content-builder.component';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase {
  id: string;
  @ViewChild('contentBuilder') contentBuilder: ContentBuilderComponent;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-section-id')) {
        this.id = paramMap.get('course-section-id');
      }
    });
  }
}
