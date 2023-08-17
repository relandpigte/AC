import { Component, Injector, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-tutor-students',
  templateUrl: './tutor-students.component.html',
  styleUrls: ['./tutor-students.component.less']
})
export class TutorStudentsComponent extends AppComponentBase implements OnInit {
  @Input() isModal: boolean;

  constructor(
    injector: Injector,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleViewAllStudents(event: Event): void {
    event.preventDefault();
    const modalSettings = <ModalOptions<TutorStudentsComponent>>this.defaultModalSettings;
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
    modalSettings.class = 'modal-dialog-centered modal-lg modal-service-users';
    modalSettings.initialState = {
      isModal: true
    };
    const modal = this._modalService.show(TutorStudentsComponent, modalSettings).content;
  }

  onCloseStudentsPopup(): void {
    this._modalService.hide();
  }
}
