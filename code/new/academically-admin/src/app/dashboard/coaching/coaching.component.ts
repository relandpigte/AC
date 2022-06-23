import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingsServiceProxy, CoachingType, CreateCoachingDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateCoachingComponent } from './_components/create-coaching/create-coaching.component';
import { CoachingTemplate } from './_models/coaching-template';

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
    private _coachingService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  onNewCoachingClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: CoachingTemplate) => {
      const model = new CreateCoachingDto();
      model.name = '';
      model.type = template.type;

      const createCoachingModalSettings = this.defaultModalSettings as ModalOptions<CreateCoachingComponent>;
      createCoachingModalSettings.initialState = { model: model };
      const createCoachingModal = this._modalService.show(CreateCoachingComponent, createCoachingModalSettings).content;
      createCoachingModal.createCoaching.subscribe(coaching => {
        this._coachingService.create(coaching)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === CoachingType.Single) {
              this._router.navigate(['/app/dashboard/coaching/', response.id]);
            } else {
              this._router.navigate(['/app/dashboard/coaching/series/', response.id]);
            }
          });
      });
    });
  }
}
