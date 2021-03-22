import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditProfileQualificationComponent } from './create-edit-profile-qualification/create-edit-profile-qualification.component';

@Component({
  selector: 'app-profile-qualifications',
  templateUrl: './profile-qualifications.component.html',
  styleUrls: ['./profile-qualifications.component.less']
})
export class ProfileQualificationsComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    this.showCreateEditQualificationModal();
  }

  private showCreateEditQualificationModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(CreateEditProfileQualificationComponent, modalSettings).content;
  }
}
