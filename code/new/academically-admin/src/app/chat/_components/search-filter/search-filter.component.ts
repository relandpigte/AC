import { Component, ElementRef, Injector, OnInit, Output } from '@angular/core';
import { SearchUsersComponent } from '@app/chat/_components/search-users/search-users.component';
import { ViewChild } from '@node_modules/@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { Subject, of, timer } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.less']
})
export class SearchFilterComponent extends AppComponentBase implements OnInit {
  searchFilterTrigger$: Subject<string> = new Subject();

  collection = 0;
  @Output() onComposeMessage: Subject<any> = new Subject<any>();
  @ViewChild(SearchUsersComponent) searchUsersComponent: SearchUsersComponent;

  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _chatService: ChatService
  ) {
    super(injector);
    this._chatService.selectedChannelType$
      .subscribe(collection => this.collection = collection);
  }

  ngOnInit(): void {
    this.searchFilterTrigger$
      .pipe(takeUntil(this.destroyed$))
      .pipe(distinctUntilChanged())
      .pipe(debounce(f => !!f ? timer(1000) : of(null)))
      .subscribe(searchFilter => this._chatService.searchKeyword$.next(searchFilter));
  }

  clearSearchFilter(): void {
    const el = this._elRef?.nativeElement?.querySelector('input#search-filter');
    if (el) el.value = '';
    this.searchFilterTrigger$.next('');
  }

  handleChangeCollection(evt, collection): void {
    this.collection = collection;
    this._chatService.selectedChannelType$.next(collection);
    evt.stopPropagation();
  }

  handleComposeMessage(): void {
    this.onComposeMessage.next();
  }
}
