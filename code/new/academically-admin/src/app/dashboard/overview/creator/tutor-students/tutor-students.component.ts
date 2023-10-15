import { Component, Injector, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tutor-students',
  templateUrl: './tutor-students.component.html',
  styleUrls: ['./tutor-students.component.less']
})
export class TutorStudentsComponent extends AppComponentBase implements OnInit {
  @Input() isModal: boolean;

  students: UserDto[] = [];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _profilesService: ProfilesServiceProxy
  ) {
    super(injector);
  }

  get userId(): number { return this.appSession.userId; }
  get totalStudent(): number { return this.students.length; }

  ngOnInit(): void {
    this.initStudents();
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

  private initStudents(): void {
    this._profilesService.getAllStudentsByOwnerId(this.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(students => {
        this.students = students;
      });
  }
}
