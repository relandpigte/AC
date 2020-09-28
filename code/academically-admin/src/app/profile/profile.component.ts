import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormCanDeactive } from '@shared/models/can-deactivate/form-can-deactivate';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  animations: [appModuleAnimation()]
})
export class ProfileComponent extends FormCanDeactive implements OnInit {
  @ViewChild('profileDetailsComponent') profileDetailsComponent: ProfileDetailsComponent;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.changesNotYetSavedMessage = this.l('ProfileDetailsNotSavedWarning');
  }

  get form(): NgForm {
    return this.profileDetailsComponent.form;
  }

  ngOnInit(): void {
  }

}
