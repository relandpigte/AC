import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto, EventsServiceProxy, EventStatus } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new EventDto();
  isLoading = false;
  WorkshopStatus = EventStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _workshopService: EventService,
    private _workshopsService: EventsServiceProxy,
    private _modalDialogService: ModalDialogService
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
    this._workshopService.eventCreated$
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
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishWorkshopConfirmationMessage'),
      confirmCb: (): void => {
        this._workshopsService.updateStatus(this.model.id, EventStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = EventStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishWorkshopConfirmationMessage'),
      confirmCb: (): void => {
        this._workshopsService.updateStatus(this.model.id, EventStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = EventStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getWorkshop(): void {
    this._workshopsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._workshopService.eventCreated = response;
      });
  }
}
