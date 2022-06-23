import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CoachingType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CoachingTemplate } from '../../_models/coaching-template';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.less']
})
export class ChooseTemplateComponent implements OnInit {
  @Output() selectTemplate = new EventEmitter<CoachingTemplate>();
  templates: CoachingTemplate[] = [];

  constructor(
    private _modal: BsModalRef,
  ) {
    const singleCoachingTemplate = new CoachingTemplate();
    singleCoachingTemplate.type = CoachingType.Single;
    singleCoachingTemplate.name = 'SingleCoaching';
    singleCoachingTemplate.description = 'SingleCoachingDescription';
    this.templates.push(singleCoachingTemplate);

    const coachingSeriesTemplate = new CoachingTemplate();
    coachingSeriesTemplate.type = CoachingType.Series;
    coachingSeriesTemplate.name = 'CoachingSeries';
    coachingSeriesTemplate.description = 'CoachingSeriesDescription';
    this.templates.push(coachingSeriesTemplate);
  }

  ngOnInit(): void {
  }

  onTemplateSelect(template: CoachingTemplate): void {
    this.selectTemplate.emit(template);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
