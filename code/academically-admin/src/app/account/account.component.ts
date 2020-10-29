import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormCanDeactive } from '@shared/models/can-deactivate/form-can-deactivate';
import { AccountDetailsComponent } from './account-details/account-details.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less'],
  animations: [appModuleAnimation()],
})
export class AccountComponent extends FormCanDeactive implements OnInit {
  @ViewChild('accountDetailsComponent') accountDetailsComponent: AccountDetailsComponent;

  constructor(injector: Injector) {
    super(injector);
    this.changesNotYetSavedMessage = this.l('ProfileDetailsNotSavedWarning');
  }

  get form(): NgForm {
    return this.accountDetailsComponent.form;
  }

  ngOnInit(): void {}
}
