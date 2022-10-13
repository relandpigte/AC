import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-attendee-open-dialog',
  templateUrl: './attendee-open-dialog.component.html',
  styleUrls: ['./attendee-open-dialog.component.less']
})
export class AttendeeOpenDialogComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this._modalRef.hide();
  }
}
