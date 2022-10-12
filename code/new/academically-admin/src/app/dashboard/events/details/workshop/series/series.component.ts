import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateWorkshopDto, WorkshopDto, WorkshopsServiceProxy, WorkshopType, WorkshopStatus } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CreateWorkshopComponent } from '../../../_components/create-workshop/create-workshop.component';
import { WorkshopService } from '../../../_services/workshop.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less'],
  animations: [appModuleAnimation()],
})
export class SeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new WorkshopDto();

  WorkshopStatus = WorkshopStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _workshopsService: WorkshopsServiceProxy,
    private _workshopService: WorkshopService,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
        this.getWorkshopSeries();
      }
    });
  }

  ngOnInit(): void {
    this._workshopService.workshopCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onAddWorkshopClick(): void {
    const newWorkshop = new CreateWorkshopDto();
    newWorkshop.type = WorkshopType.Single;
    newWorkshop.name = '';
    newWorkshop.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
    modalSettings.initialState = {
      model: newWorkshop,
    };
    const modal = this._modalService.show(CreateWorkshopComponent, modalSettings).content;
    modal.createWorkshop.subscribe(workshop => {
      this._workshopsService.create(workshop)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/dashboard/events/workshop/series', response.parentId, response.id]);
        });
    });
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

  private getWorkshopSeries(): void {
    this._workshopsService.get(this.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._workshopService.workshopCreated = response;
      });
  }
}
