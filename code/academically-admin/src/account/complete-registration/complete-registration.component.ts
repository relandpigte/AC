import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { RegistrationsServiceProxy, RegistrationDto, RegisterInput, RegisterOutput, AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.less'],
  animations: [accountModuleAnimation()]
})
export class CompleteRegistrationComponent extends AppComponentBase implements OnInit {
  registrationId: string;
  model: RegisterInput;
  saving = false;
  isLoading = false;

  constructor(
    injector: Injector,
    private _registrationsService: RegistrationsServiceProxy,
    private _accountsService: AccountServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    super(injector);
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.registrationId = paramMap.get('id');
      this.getRegistration();
    });
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.register();
  }

  private register(): void {
    this.saving = true;
    this._accountsService
      .register(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: RegisterOutput) => {
        this.notify.success(this.l('SuccessfullyRegistered'));
        this._router.navigate(['/account/login']);
        return;
      });
  }

  private getRegistration(): void {
    this.isLoading = true;
    this._registrationsService.get(this.registrationId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(registration => {
        this.model = new RegisterInput();
        this.model.name = registration.firstName;
        this.model.surname = registration.lastName;
        this.model.userName = registration.emailAddress;
        this.model.emailAddress = registration.emailAddress;
      }, (err) => {
        this._router.navigate(['/account/login']);
      });
  }
}
