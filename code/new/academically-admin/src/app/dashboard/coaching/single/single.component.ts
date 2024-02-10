import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { CoachingDto, CoachingsServiceProxy, CoachingStatus, ServicesType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { CoachingService } from '../_services/coaching.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { CommunityPostService } from '@shared/services/community-post.service';
import { MenuItem, ServiceCreateService } from '@shared/services/service-create.service';

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
  defaultMenuItem: MenuItem;
  menuItems: MenuItem[] = [
    {
      id: 'details',
      label: 'Details',
      icon: 'assets/img/service/create/list.svg',
      iconHover: 'assets/img/service/create/list-hover.svg',
      infoText: 'Here, you can input all the details for your session. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: 'assets/img/service/create/pie-chart.svg',
      iconHover: 'assets/img/service/create/pie-chart-hover.svg',
      infoText: 'Use this section to add activities such as quizzes and polls for your students to complete during your coaching session.'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'assets/img/service/create/settings.svg',
      iconHover: 'assets/img/service/create/settings-hover.svg',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: 'assets/img/service/create/layers.svg',
      iconHover: 'assets/img/service/create/layers-hover.svg',
      infoText: 'Here 2, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'studio',
      label: 'Studio',
      icon: 'assets/img/service/create/clipboard.svg',
      iconHover: 'assets/img/service/create/clipboard-hover.svg',
      infoText: 'Here 3, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    }
  ];

  readonly ServicesType = ServicesType;
  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _coachingService: CoachingService,
    private _coachingsService: CoachingsServiceProxy,
    private _communityPostService: CommunityPostService,
    private _modalDialogService: ModalDialogService,
    private _serviceCreateService: ServiceCreateService
  ) {
    super(injector);
    this._serviceCreateService.setDefaultMenuItem(this.menuItems[0]);
    this._serviceCreateService.getDefaultMenuItem().subscribe(x => this.defaultMenuItem = x);
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
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishCoachingConfirmationMessage'),
      confirmCb: (): void => {
        this._coachingsService.updateStatus(this.model.id, CoachingStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = CoachingStatus.Published;
            this.notify.success(this.l('SavedSuccessfully'));
            this._communityPostService.hasNewItemToShare({ serviceId: this.id });
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishCoachingConfirmationMessage'),
      confirmCb: (): void => {
        this._coachingsService.updateStatus(this.model.id, CoachingStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = CoachingStatus.Draft;
            this.notify.success(this.l('SavedSuccessfully'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getCoaching(): void {
    this._coachingsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._coachingService.coachingCreated = response;
      });
  }
}
