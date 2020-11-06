import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ResearchMethodDto, ResearchMethodsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import { RequestNewResearchMethodComponent } from './request-new-research-method/request-new-research-method.component';

@Component({
  selector: 'app-research-methods-search',
  templateUrl: './research-methods-search.component.html',
  styleUrls: ['./research-methods-search.component.less'],
})
export class ResearchMethodsSearchComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Output() modalSave = new EventEmitter<ResearchMethodDto[]>();
  researchMethods: TreeNode[];
  selectedResearchMethods: TreeNode[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _researchMethodsService: ResearchMethodsServiceProxy,
    private _modalRef: BsModalRef,
    private _modalService: BsModalService
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

  onAddClick(researchMethod: ResearchMethodDto): void {
    this.showResearchMethodRequestModal(researchMethod.id);
  }

  private getResearchMethods(): void {
    this.isLoading = true;
    this._researchMethodsService.getAll(this.userId).subscribe((researchMethods) => {
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
      this.message.confirm(this.l('ResearchMethodsNotSavedWarning'), undefined, (result: boolean) => {
        if (result) {
          this._modalRef.hide();
        }
      });
    } else {
      this._modalRef.hide();
    }
  }

  private showResearchMethodRequestModal(researchMethodId: string): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      researchMethodId: researchMethodId,
    };
    const modalRef = this._modalService.show(RequestNewResearchMethodComponent, modalSettings);
    const modal: RequestNewResearchMethodComponent = modalRef.content;
  }
}
