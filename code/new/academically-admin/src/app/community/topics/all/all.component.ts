import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-all-topics',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.less']
})
export class AllComponent extends AppComponentBase implements OnInit {

  parentTopics: any = this.chunkArrayInGroups(Array(12).fill([]).map(() => this.generateRandomTopic()), 3);
  forYouTopics: any = this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomTopic()), 3);
  tailoredTopics: any = { 'Topic': this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomCoaching()), 3) };

  isLoadingParentTopics = false;
  isLoadingForYouTopics = false;
  isLoadingTailoredTopics = false

  get isLoading(): boolean { return this.isLoadingParentTopics || this.isLoadingForYouTopics || this.isLoadingTailoredTopics; }

  constructor(
    injector: Injector,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadParentTopics();
    this.loadForYouTopics();
  }

  private loadParentTopics(): void {
    this.isLoadingParentTopics = true;
    this._taxonomyService.getAll(undefined, true)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoadingParentTopics = false ))
        .subscribe(topics => {
          this.parentTopics = this.chunkArrayInGroups(topics, 3);
          this.getTailoredTopics(topics);
        });
  }

  private loadForYouTopics(): void {
    this.isLoadingForYouTopics = true;
    this._taxonomyService.getAllLastChildren()
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoadingForYouTopics = false ))
        .subscribe(topics => this.forYouTopics = this.chunkArrayInGroups(topics, 3));
  }

  private getTailoredTopics(source: any, count?: number): void {
    this.isLoadingTailoredTopics = true;
    const topics = count ? _.take(source, count) : source;
    this.tailoredTopics = topics.reduce((topics, t) => ({...topics, [t.name] : this.chunkArrayInGroups(t.children, 3) }), {});
    this.isLoadingTailoredTopics = false;
  }


}
