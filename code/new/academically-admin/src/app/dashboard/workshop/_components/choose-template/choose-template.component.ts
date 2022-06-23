import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WorkshopType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkshopTemplate } from '../../_models/workshop-template';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.less']
})
export class ChooseTemplateComponent implements OnInit {
  @Output() selectTemplate = new EventEmitter<WorkshopTemplate>();
  templates: WorkshopTemplate[] = [];

  constructor(
    private _modal: BsModalRef,
  ) {
    const singleWorkshopTemplate = new WorkshopTemplate();
    singleWorkshopTemplate.type = WorkshopType.Single;
    singleWorkshopTemplate.name = 'SingleWorkshop';
    singleWorkshopTemplate.description = 'SingleWorkshopDescription';
    this.templates.push(singleWorkshopTemplate);

    const workshopSeriesTemplate = new WorkshopTemplate();
    workshopSeriesTemplate.type = WorkshopType.Series;
    workshopSeriesTemplate.name = 'WorkshopSeries';
    workshopSeriesTemplate.description = 'WorkshopSeriesDescription';
    this.templates.push(workshopSeriesTemplate);
  }

  ngOnInit(): void {
  }

  onTemplateSelect(template: WorkshopTemplate): void {
    this.selectTemplate.emit(template);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
