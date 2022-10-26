import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

export interface SearchOptions {
    sortable?: boolean;
    pagination?: boolean;
    onEnter?: boolean;
    searchDelay?: number;
    maxItems?: number;
};

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent<T> extends PagedListingComponentBase<T> implements OnChanges, AfterViewInit {
    searchFilter: string;

    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    @Input() loading: boolean = true;
    @Input() data: T[];
    @Input() pagedData: any;
    @Input() currentPage: number;
    @Input() options: SearchOptions = {};

    @Input() itemTemplate: any;
    @Input() itemLoadingTemplate: any;

    @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();

    searchInputTrigger$ = new BehaviorSubject<string>('');

    constructor(
        injector: Injector
    ) {
        super(injector);

        this.searchInputTrigger$
            .pipe(takeUntil(this.destroyed$))
            .pipe(debounceTime(this.options?.searchDelay ?? 600))
            .pipe(distinctUntilChanged())
            .subscribe(filter => {
                this.searchFilter = filter;
                this.handleOnSearch();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.options.pagination && 'pagedData' in changes && this.pagedData) {
            this.data = this.pagedData.items ?? [];
            this.showPaging(this.pagedData, this.currentPage);
        }

        if ('data' in changes && this.data) {
            if (this.options.maxItems) this.data = _.take(this.data, this.options.maxItems);
        }
    }

    ngAfterViewInit(): void {
        if (!this.options.onEnter)
            this.searchInput.nativeElement.addEventListener('keydown', (evt) => this.searchInputTrigger$.next(evt.target.value.replace(/ /g, '').toLowerCase().trim()));
    }

    protected list(request: any, pageNumber: number, finishedCallback: Function): void {
        request.userIdFilter = this.appSession.userId;
        request.searchFilter = this.searchFilter;
        this.onSearch.emit({ request, pageNumber, finishedCallback });
    }

    handleOnSearch(): void {
        this.searchFilter = this.searchInput?.nativeElement.value ?? '';

        if (this.options.pagination) this.getDataPage(1);
        else this.onSearch.emit(this.searchFilter);
    }
}
