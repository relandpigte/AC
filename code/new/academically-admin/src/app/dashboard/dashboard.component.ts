import { Component, OnInit, Injector, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { environment } from 'environments/environment';
import { takeUntil, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { UserLoginInfoDto, PaymentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from '@app/dashboard/courses/course-wizard/course-wizard.component';
import { AppConsts } from '@shared/AppConsts';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  user: UserLoginInfoDto = new UserLoginInfoDto();
  greetings: string;
  isOnboarding = false;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _paymentsService: PaymentsServiceProxy,
    private _modalDialogService: ModalDialogService,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.user = this.appSession.user;
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get defaultUserView(): DashboardServiceView { return this._dashboardService.getUserView(); }

  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isCreatorView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.creator; }

  get isLoading$() { return this._dashboardPageService.isLoading$; }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
    this._cdr.detectChanges();
  }

  ngOnInit(): void {
    this._dashboardService.setUserView(DashboardServiceView.learner);
    this.greetings = this.getGreetings();
    this._route.queryParams.subscribe(paramMap => {
      if (paramMap.code) {
        this.isOnboarding = true;
        this._paymentsService.onboardUser(paramMap.code)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isOnboarding = false;
            }),
          )
          .subscribe(stripeUserId => {
            this.notify.success(this.l('StripeOnboardingSuccessMessage'));
            this.appSession.user.stripeUserId = stripeUserId;
            this.user.stripeUserId = stripeUserId;
            this._router.navigate(['/app/dashboard']);
          });
      } else {
        this.isOnboarding = false;
      }
    });

    setTimeout(() => this._dashboardPageService.setIsLoading(false), 3000);
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }

  getGreetings(): string {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMin = currentTime.getMinutes();

    if (currentHours >= 5 && currentHours <= 11 && currentMin <= 59) {
      return this.l('GoodMorning');
    } else if (currentHours >= 12 && currentHours <= 16 && currentMin <= 59) {
      return this.l('GoodAfternoon');
    } else if (currentHours >= 17 || (currentHours >= 0 && currentHours <= 4) && currentMin <= 59) {
      return this.l('GoodEvening');
    }
  }

  onCreateClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }

  onConnectStripeClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('StripeOnboardingConfirmationMessage'),
      confirmCb: (): void => {
        window.location.href = environment.providers.stripe.onbloardLink(
          environment.providers.stripe.clientId,
          AppConsts.appBaseUrl
        );
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }
}
