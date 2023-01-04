import { Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AvailableServiceDto, PostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-service-picker',
    templateUrl: './service-picker.component.html',
    styleUrls: ['./service-picker.component.scss'],
    animations: [appModuleAnimation()]
})
export class ServicePickerComponent extends AppComponentBase implements OnChanges {
    @Input() selectedService: AvailableServiceDto;
    @Input() isShown = false;

    @Output() onBack = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @Output() onAdd = new EventEmitter<any>();

    availableServices: AvailableServiceDto[];

    searchFilter: string;

    isSearching = false

    constructor(
        injector: Injector,
        private _postsService: PostsServiceProxy
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isSearching; }

    ngOnChanges(changes: SimpleChanges): void {
        if ('isShown' in changes && changes.isShown?.previousValue != changes.isShown?.currentValue && this.isShown) {
            this.handleOnSearch(this.searchFilter);
        }
    }

    isServiceSelected(service: AvailableServiceDto): boolean {
        return this.selectedService && this.selectedService?.id === service?.id;
    }

    setSelectedService(service: AvailableServiceDto): void {
        if (!this.selectedService || this.selectedService.id !== service.id) {
            this.selectedService = service;
        } else {
            this.selectedService = null;
        }
    }

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;

        this.isSearching = true;
        this._postsService.getAvailableServices(searchFilter, 10, 'recent', 0, 10)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isSearching = false))
            .subscribe(availableServices =>  this.availableServices = availableServices.items);
    }

    handleOnClose(): void {
        this.onClose.emit();
    }

    handleOnBack(): void {
        this.onBack.emit();
    }

    handleOnAdd(): void {
        this.onAdd.emit(this.selectedService);
    }
}
