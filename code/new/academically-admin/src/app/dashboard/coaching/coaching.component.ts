import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingsServiceProxy, CreateCoachingDto, CoachingType, CreateWorkshopDto, WorkshopType, WorkshopsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateCoachingComponent } from './_components/create-coaching/create-coaching.component';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CreateWorkshopComponent } from '../workshop/_components/create-workshop/create-workshop.component';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [appModuleAnimation()],
})
export class CoachingComponent extends AppComponentBase  {
  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _coachingService: CoachingsServiceProxy,
    private _workshopService: WorkshopsServiceProxy
  ) {
    super(injector);
  }

  onNewCoachingClick(): void {
    const model = new CreateCoachingDto();
    model.name = '';
    model.type = CoachingType.Single;

    const createCoachingModalSettings = this.defaultModalSettings as ModalOptions<CreateCoachingComponent>;
    createCoachingModalSettings.initialState = { model: model };
    const createCoachingModal = this._modalService.show(CreateCoachingComponent, createCoachingModalSettings).content;
    createCoachingModal.createCoaching.subscribe(coaching => {
      this._coachingService.create(coaching)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['/app/dashboard/coaching/', response.id]);
        });
    });
  }

  onNewWorkshopClick(): void {
    const model = new CreateWorkshopDto();
    model.name = '';
    model.type = WorkshopType.Single;

    const createWorkshopModalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
    createWorkshopModalSettings.initialState = { model: model };
    const createWorkshopModal = this._modalService.show(CreateWorkshopComponent, createWorkshopModalSettings).content;
    createWorkshopModal.createWorkshop.subscribe(workshop => {
      this._workshopService.create(workshop)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['/app/dashboard/workshop/', response.id]);
        });
    });
  }
}
