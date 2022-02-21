import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventTemplate } from '../../_models/event-template';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.less']
})
export class ChooseTemplateComponent implements OnInit {
  @Output() selectTemplate = new EventEmitter<EventTemplate>();
  templates: EventTemplate[] = [];

  constructor(
    private _modal: BsModalRef,
  ) {
    const singleEventTemplate = new EventTemplate();
    singleEventTemplate.type = EventType.SingleEvent;
    singleEventTemplate.name = 'SingleEvent';
    singleEventTemplate.description = 'SingleEventDescription';
    this.templates.push(singleEventTemplate);

    const eventSeriesTemplate = new EventTemplate();
    eventSeriesTemplate.type = EventType.EventSeries;
    eventSeriesTemplate.name = 'EventSeries';
    eventSeriesTemplate.description = 'EventSeriesDescription';
    this.templates.push(eventSeriesTemplate);
  }

  ngOnInit(): void {
  }

  onTemplateSelect(template: EventTemplate): void {
    this.selectTemplate.emit(template);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
