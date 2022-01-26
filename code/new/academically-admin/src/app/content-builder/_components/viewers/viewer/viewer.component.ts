import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Content } from '../../../_models/content';
import { PageBuilderService } from '../../../_services/page-builder.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.less']
})
export class ViewerComponent extends AppComponentBase implements OnInit {
  @Input() content: Content;

  constructor(
    injector: Injector,
    pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    pageBuilderService.content$.subscribe(content => {
      if (content && ['lesson', 'page'].includes(content.type)) {
        this.content = content;
      }
    });
  }

  ngOnInit(): void {
  }

}
