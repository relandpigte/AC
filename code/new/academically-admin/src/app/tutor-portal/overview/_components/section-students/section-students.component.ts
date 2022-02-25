import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { StudentCourseSectionsServiceProxy, StudentCourseSectionDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SectionStudentsFullComponent } from '../section-students-full/section-students-full.component';

@Component({
  selector: 'app-section-students',
  templateUrl: './section-students.component.html',
  styleUrls: ['./section-students.component.less']
})
export class SectionStudentsComponent extends AppComponentBase implements OnInit {
  @Input() courseSectionId: string;
  models: StudentCourseSectionDto[] = [];
  limitDiff = 0;

  private _limit = 3;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getStudentCourseSections();
  }

  onClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<SectionStudentsFullComponent>;
    modalSettings.initialState = {
      courseSectionId: this.courseSectionId,
    };
    this._modalService.show(SectionStudentsFullComponent, modalSettings);
  }

  private getStudentCourseSections(): void {
    console.log(this.courseSectionId);
    this._studentCourseSectionsService.getAllInProgress(
      this.courseSectionId,
      0,
      this._limit,
    ).pipe(takeUntil(
      this.destroyed$
    )).subscribe(response => {
      this.models = response.items;
      this.limitDiff = response.totalCount - this._limit;
    });
  }
}
