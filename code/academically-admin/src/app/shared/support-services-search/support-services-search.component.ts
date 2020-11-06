import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SupportServiceDto, SupportServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import { RequestNewSupportServiceComponent } from './request-new-support-service/request-new-support-service.component';

@Component({
  selector: 'app-support-services-search',
  templateUrl: './support-services-search.component.html',
  styleUrls: ['./support-services-search.component.less'],
})
export class SupportServicesSearchComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Output() modalSave = new EventEmitter<SupportServiceDto[]>();
  supportServices: TreeNode[];
  selectedSupportServices: TreeNode[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _supportServicesService: SupportServicesServiceProxy,
    private _modalRef: BsModalRef,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getSupportServices();
  }

  onFormSubmit(): void {
    this._modalRef.hide();
    setTimeout(() => {
      const supportServices: SupportServiceDto[] = this.selectedSupportServices.map((e) => e.data);
      this.modalSave.emit(supportServices);
    }, 300);
  }

  onCloseClick(): void {
    this.close();
  }

  onRemoveClick(key: string): void {
    const index = this.selectedSupportServices.findIndex((e) => e.key === key);
    if (index >= 0) {
      this.selectedSupportServices.splice(index, 1);
    }
  }

  onAddClick(supportService: SupportServiceDto): void {
    this.showSupportServiceRequestModal(supportService.id);
  }

  private getSupportServices(): void {
    this.isLoading = true;
    this._supportServicesService.getAll(this.userId).subscribe((supportServices) => {
      this.supportServices = this.buildTreeNodes(supportServices);
      this.isLoading = false;
    });
  }

  private buildTreeNodes(treeItems: SupportServiceDto[]): TreeNode[] {
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
    if (this.selectedSupportServices.length > 0) {
      this.message.confirm(this.l('SupportServicesNotSavedWarning'), undefined, (result: boolean) => {
        if (result) {
          this._modalRef.hide();
        }
      });
    } else {
      this._modalRef.hide();
    }
  }

  private showSupportServiceRequestModal(supportServiceId: string): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      supportServiceId: supportServiceId,
    };
    const modalRef = this._modalService.show(RequestNewSupportServiceComponent, modalSettings);
    const modal: RequestNewSupportServiceComponent = modalRef.content;
  }
}
