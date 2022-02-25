import { Component, Input, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PreviewService } from '../../_services/preview.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  constructor(
    injector: Injector,
    private _previewService: PreviewService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._previewService.video$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.referenceId = response.id;
        }
      });
  }

}
