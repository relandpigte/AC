import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SubjectsServiceProxy, SuggestSubjectDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-suggest-service-subject',
  templateUrl: './suggest-service-subject.component.html',
  styleUrls: ['./suggest-service-subject.component.less']
})
export class SuggestServiceSubjectComponent extends AppComponentBase implements OnInit {
  @Input() categoryName: string;
  @Input() serviceName: string;
  @Input() levelName: string;
  @Input() levelId: string;
  @Output() modelSaved = new EventEmitter();
  model: SuggestSubjectDto = new SuggestSubjectDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _subjectsService: SubjectsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.model.serviceId = this.levelId;
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._subjectsService.suggestSubject(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe(() => {
        this.modelSaved.emit();
        this.message.success(this.l('SubjectSuggestionSubmittedMessage'));
        this._modal.hide();
      })
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
