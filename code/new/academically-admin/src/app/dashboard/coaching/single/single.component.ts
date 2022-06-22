import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { CoachingDto, CoachingsServiceProxy, CoachingStatus } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { CoachingService } from '../_services/coaching.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new CoachingDto();
  isLoading = false;
  CoachingStatus = CoachingStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _coachingService: CoachingService,
    private _coachingsService: CoachingsServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getCoaching();
    this._coachingService.coachingCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onCoachingPreviewClick(): void {
  }

  onPublishClick(): void {
    this.message.confirm(this.l('PublishCoachingConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._coachingsService.updateStatus(this.model.id, CoachingStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = CoachingStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  onUnpublishClick(): void {
    this.message.confirm(this.l('UnpublishCoachingConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._coachingsService.updateStatus(this.model.id, CoachingStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = CoachingStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  private getCoaching(): void {
    this._coachingsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._coachingService.coachingCreated = response;
      });
  }
}
