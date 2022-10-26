import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';

import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-more-topics',
    templateUrl: './more-topics.component.html',
    styleUrls: ['./more-topics.component.scss']
})
export class MoreTopicsComponent extends AppComponentBase implements OnInit {

    data: DisciplineTaxonomyDto[] = [];

    isSearching = false;

    constructor(
        injector: Injector,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isSearching; }

    ngOnInit(): void {
    }

    handleOnSearch(searchFilter: string): void {
        this.isSearching = true;
        this._taxonomyService.search(searchFilter)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isSearching = false))
            .subscribe(results => this.data = results);
    }
}
