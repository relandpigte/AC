import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserLoginInfoDto, PaymentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { CourseWizardComponent } from '@app/dashboard/courses/course-wizard/course-wizard.component';
import { environment } from 'environments/environment';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit {
  user: UserLoginInfoDto = new UserLoginInfoDto();
  greetings: string;
  isOnboarding = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _paymentsService: PaymentsServiceProxy,
  ) {
    super(injector);
    this.user = this.appSession.user;
  }

  ngOnInit(): void {
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
    this.message.confirm(
      this.l('StripeOnboardingConfirmationMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          window.location.href = environment.providers.stripe.onbloardLink(environment.providers.stripe.clientId, AppConsts.appBaseUrl);
        }
      }
    );
  }
}
