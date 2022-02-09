import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PageContent } from '../../../_models/page-content';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { CreateEditPageComponent } from '../../create-edit-page/create-edit-page.component';
import { LessonContent } from '../../../_models/lesson-content';
import { DragulaService } from 'ng2-dragula';
import { PageBuilderService } from '../../../_services/page-builder.service';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.less']
})
export class LessonEditorComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() lesson: LessonContent;
  dragulaGroup = 'PAGES';

  constructor(
    injector: Injector,
    private _dragulaService: DragulaService,
    private _modalService: BsModalService,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    _dragulaService.createGroup(this.dragulaGroup, {
      moves: (el, source, handle) => handle.classList.contains('drag-handle'),
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._dragulaService.destroy(this.dragulaGroup);
  }

  onAddClick(): void {
    this.showCreateEditPageModal();
  }

  onEditClick(content: PageContent): void {
    this.showCreateEditPageModal(content);
  }

  onPageClick(page: PageContent): void {
    this._pageBuilderService.content = page;
  }

  private showCreateEditPageModal(content?: PageContent): void {
    const isEdit = !_.isNil(content);
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPageComponent>;
    modalSettings.initialState = {
      isEdit: isEdit,
      content: isEdit ? _.cloneDeep(content) : new PageContent(),
    };
    const modal = this._modalService.show(CreateEditPageComponent, modalSettings).content;
    modal.modalSave.subscribe(newContent => {
      if (!isEdit) {
        this.lesson.pages.push(newContent);
      } else {
        content.name = newContent.name;
      }
    });
  }
}
