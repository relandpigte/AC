import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ResearchMethodDto, ResearchMethodsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-research-method-tree',
  templateUrl: './research-method-tree.component.html',
  styleUrls: ['./research-method-tree.component.less']
})
export class ResearchMethodTreeComponent extends AppComponentBase implements OnInit {
  @Output() modalSave = new EventEmitter<ResearchMethodDto[]>();
  researchMethods: TreeNode[];
  selectedResearchMethods: TreeNode[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _researchMethodsService: ResearchMethodsServiceProxy,
    private _modalRef: BsModalRef,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getResearchMethods();
  }

  onFormSubmit(): void {
    this._modalRef.hide();
    setTimeout(() => {
      const researchMethods: ResearchMethodDto[] = this.selectedResearchMethods.map((e) => e.data);
      this.modalSave.emit(researchMethods);
    }, 300);
  }

  onCloseClick(): void {
    this.close();
  }

  onRemoveClick(key: string): void {
    const index = this.selectedResearchMethods.findIndex((e) => e.key === key);
    if (index >= 0) {
      this.selectedResearchMethods.splice(index, 1);
    }
  }

  private getResearchMethods(): void {
    this.isLoading = true;
    this._researchMethodsService.getAll().subscribe((researchMethods) => {
      this.researchMethods = this.buildTreeNodes(researchMethods);
      this.isLoading = false;
    });
  }

  private buildTreeNodes(treeItems: ResearchMethodDto[]): TreeNode[] {
    const treeNodes: TreeNode[] = [];
    _.forEach(treeItems, (treeItem) => {
      const treeNode: TreeNode = {
        key: treeItem.id,
        label: treeItem.name,
        data: treeItem,
      };
      if (_.isArray(treeItem.children)) {
        treeNode.children = this.buildTreeNodes(treeItem.children);
      }
      if (treeItem.isEditable) {
        treeNode.type = 'editable';
      }
      treeNodes.push(treeNode);
    });
    return treeNodes;
  }

  private close(): void {
    if (this.selectedResearchMethods.length > 0) {
      const options: ModalDialogOptions = {
        title: this.l('AreYouSure'),
        text: this.l('ResearchMethodsNotSavedWarning'),
        confirmCb: (): void => {
          this._modalRef.hide();
        }
      };
      this._modalDialogService.showConfirmDialog(options);
    } else {
      this._modalRef.hide();
    }
  }
}
