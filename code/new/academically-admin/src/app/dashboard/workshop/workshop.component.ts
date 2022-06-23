import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { WorkshopsServiceProxy, CreateWorkshopDto, WorkshopType } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { WorkshopTemplate } from './_models/workshop-template';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.less'],
  animations: [appModuleAnimation()],
})
export class WorkshopComponent extends AppComponentBase  {
  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _workshopService: WorkshopsServiceProxy
  ) {
    super(injector);
  }

  onNewWorkshopClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: WorkshopTemplate) => {
      const model = new CreateWorkshopDto();
      model.name = '';
      model.type = template.type;

      const createWorkshopModalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
      createWorkshopModalSettings.initialState = { model: model };
      const createWorkshopModal = this._modalService.show(CreateWorkshopComponent, createWorkshopModalSettings).content;
      createWorkshopModal.createWorkshop.subscribe(workshop => {
        this._workshopService.create(workshop)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === WorkshopType.Single) {
              this._router.navigate(['/app/dashboard/workshop/', response.id]);
            } else {
              this._router.navigate(['/app/dashboard/workshop/series/', response.id]);
            }
          });
      });
    });
  }
}
