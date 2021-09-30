import { Component, OnInit, EventEmitter, Output, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionsServiceProxy, CourseSectionDto, CourseSectionType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.less']
})
export class NameComponent extends AppComponentBase implements OnInit {
  @Input() courseId: string;
  @Input() currentcourseSectionType: CourseSectionType;
  @Output() courseSaved = new EventEmitter();
  @Output() modalClose = new EventEmitter();
  @Output() backClick = new EventEmitter();

  model = new CourseSectionDto();
  isLoading = false;
  CourseSectionType = CourseSectionType;

  constructor(
    injector: Injector,
    private _courseSectionsService: CourseSectionsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.modalClose.emit();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.courseId = this.courseId;
    this.model.type = this.currentcourseSectionType;
    this._courseSectionsService.create(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.isLoading = false;
        this.notify.success(this.l('SavedSuccessfully'));
        this.courseSaved.emit();
        this.modalClose.emit();
      });
  }
}
