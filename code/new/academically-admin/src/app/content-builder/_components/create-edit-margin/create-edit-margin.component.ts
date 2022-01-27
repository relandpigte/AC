import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentMarginDto, ContentMarginsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-margin',
  templateUrl: './create-edit-margin.component.html',
  styleUrls: ['./create-edit-margin.component.less']
})
export class CreateEditMarginComponent extends AppComponentBase implements OnInit {
  @Input() model = new ContentMarginDto();
  @Output() modelSave = new EventEmitter<ContentMarginDto>();
  isLoading = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _contentMarginsService: ContentMarginsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.isLoading = true;
    (this.model.id
      ? this._contentMarginsService.update(this.model)
      : this._contentMarginsService.create(this.model))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.modelSave.emit(response);
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
