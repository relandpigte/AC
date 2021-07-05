import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-research-fields-tree',
  templateUrl: './research-fields-tree.component.html',
  styleUrls: ['./research-fields-tree.component.less']
})
export class ResearchFieldsTreeComponent extends AppComponentBase implements OnInit {
  @Output() modalSave = new EventEmitter<DisciplineTaxonomyDto[]>();
  disciplineTaxonomies: TreeNode[];
  selectedDisciplineTaxonomies: TreeNode[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy,
    private _modalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
  }

  onFormSubmit(): void {
    this._modalRef.hide();
    setTimeout(() => {
      const researchFields: DisciplineTaxonomyDto[] = this.selectedDisciplineTaxonomies.map((e) => e.data);
      this.modalSave.emit(researchFields);
    }, 300);
  }

  onCloseClick(): void {
    this.close();
  }

  onRemoveClick(key: string): void {
    const index = this.selectedDisciplineTaxonomies.findIndex((e) => e.key === key);
    if (index >= 0) {
      this.selectedDisciplineTaxonomies.splice(index, 1);
    }
  }

  private getDisciplineTaxonomies(): void {
    this.isLoading = true;
    this._disciplineTaxonomiesService.getAll().subscribe((researchInterest) => {
      this.disciplineTaxonomies = this.buildTreeNodes(researchInterest);
      this.isLoading = false;
    });
  }

  private buildTreeNodes(treeItems: DisciplineTaxonomyDto[]): TreeNode[] {
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
    if (this.selectedDisciplineTaxonomies.length > 0) {
      this.message.confirm(this.l('ResearhFieldsNotSavedWarning'), undefined, (result: boolean) => {
        if (result) {
          this._modalRef.hide();
        }
      });
    } else {
      this._modalRef.hide();
    }
  }
}
