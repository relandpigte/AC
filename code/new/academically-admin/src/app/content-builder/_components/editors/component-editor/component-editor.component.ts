import { Component, OnInit, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentMarginDto, ContentMarginsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ComponentContent } from '../../../_models/component-content';
import { MarginType } from '../../../_models/margin-type';
import { PageBuilderService } from '../../../_services/page-builder.service';
import { CreateEditMarginComponent } from '../../create-edit-margin/create-edit-margin.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-component-editor',
  templateUrl: './component-editor.component.html',
  styleUrls: ['./component-editor.component.less']
})
export class ComponentEditorComponent extends AppComponentBase implements OnInit {
  @Input() component: ComponentContent;
  MarginType = MarginType;
  contentMargins: ContentMarginDto[] = [];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _pageBuilderService: PageBuilderService,
    private _contentMarginsService: ContentMarginsServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getContentMargins();
  }

  onMoveUpClick(): void {
    this._pageBuilderService.nagivateUp = this.component;
  }

  onMarginTypeChange(contentMargin?: ContentMarginDto): void {
    this.setLayout(contentMargin);
  }

  onRemoveClick(): void {
    this._pageBuilderService.remove = this.component;
  }

  onAddCustomMarginClick(): void {
    this.showCreateEditContentMarginModal();
  }

  onEditCustomMarginClick(contentMargin: ContentMarginDto): void {
    this.showCreateEditContentMarginModal(contentMargin);
  }

  onDeleteCustomMarginClick(contentMargin: ContentMarginDto): void {
    const options: ModalDialogOptions = {
      title: undefined,
      text: undefined,
      confirmCb: (): void => {
        this._contentMarginsService.delete(contentMargin.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.getContentMargins();
            if (this.component.marginType === contentMargin.id) {
              this.component.marginType = MarginType.Narrow;
              this.setLayout();
            }
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getContentMargins(): void {
    this._contentMarginsService.getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.contentMargins = responses;
      });
  }

  private showCreateEditContentMarginModal(contentMargin?: ContentMarginDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditMarginComponent>;
    modalSettings.initialState = {
      model: contentMargin ? _.cloneDeep(contentMargin) : new ContentMarginDto(),
    };
    const modal = this._modalService.show(CreateEditMarginComponent, modalSettings).content;
    modal.modelSave.subscribe((response: ContentMarginDto) => {
      console.log(response);
      this.getContentMargins();
      this.component.marginType = response.id;
      this.setLayout(response);
    });
  }

  private setLayout(contentMargin?: ContentMarginDto): void {
    if (contentMargin) {
      this.component.marginTop = contentMargin.top;
      this.component.marginBottom = contentMargin.bottom;
      this.component.width = contentMargin.width;
    }
    this.component.setMargins();
  }
}
