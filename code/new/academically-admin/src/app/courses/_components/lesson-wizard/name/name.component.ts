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
  @Input() parentId: string;
  @Input() model = new CourseSectionDto();
  @Output() courseSaved = new EventEmitter();
  @Output() modalClose = new EventEmitter();
  @Output() backClick = new EventEmitter();

  isLoading = false;
  CourseSectionType = CourseSectionType;

  constructor(
    injector: Injector,
    private _courseSectionsService: CourseSectionsServiceProxy,
  ) {
    super(injector);
  }

  get title(): string {
    switch (this.currentcourseSectionType) {
      case CourseSectionType.Module:
        return 'NameYourNewModule';
      case CourseSectionType.Unit:
        return 'NameYourNewUnit';
      default:
        return 'NameYourNewLesson';
    }
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.modalClose.emit();
  }

  onFormSubmit(): void {
    this.isLoading = true;

    if (!this.model.id) {
      this.model.courseId = this.courseId;
      this.model.parentId = this.parentId;
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
    } else {
      this._courseSectionsService.update(this.model)
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

  onBackClick(): void {
    this.backClick.emit();
  }
}
