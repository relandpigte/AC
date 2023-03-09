import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AvailableServiceDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-add-service',
    templateUrl: './add-service.component.html',
    styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
    selectedService: AvailableServiceDto;

    @Output() onAdd = new EventEmitter<any>();

    constructor(
        private _modal: BsModalRef,
    ) {
    }

    ngOnInit(): void {
    }

    onCloseClick(): void {
      this._modal.hide();
    }

    onAddService(service: AvailableServiceDto): void {
        this.selectedService = service;
        this.onAdd.emit(this.selectedService);
        this._modal.hide();
    }
}
