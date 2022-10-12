import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { WorkshopDto, WorkshopsServiceProxy, WorkshopStatus } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { WorkshopService } from '../../../_services/workshop.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new WorkshopDto();
  isLoading = false;
  WorkshopStatus = WorkshopStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _workshopService: WorkshopService,
    private _workshopsService: WorkshopsServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getWorkshop();
    this._workshopService.workshopCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onWorkshopPreviewClick(): void {
  }

  onPublishClick(): void {
    this.message.confirm(this.l('PublishWorkshopConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._workshopsService.updateStatus(this.model.id, WorkshopStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = WorkshopStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  onUnpublishClick(): void {
    this.message.confirm(this.l('UnpublishWorkshopConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._workshopsService.updateStatus(this.model.id, WorkshopStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = WorkshopStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  private getWorkshop(): void {
    this._workshopsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._workshopService.workshopCreated = response;
      });
  }
}
