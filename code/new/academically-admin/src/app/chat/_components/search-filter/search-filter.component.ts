import { Component, OnInit } from '@angular/core';
import { ChatService } from '@shared/services/chat.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.less']
})
export class SearchFilterComponent implements OnInit {

  collection = 0;

  constructor(
    private _chatService: ChatService
  ) {
    this._chatService.selectedChannel$
      .subscribe(collection => this.collection = collection);
  }

  ngOnInit(): void {
  }

  handleChangeCollection(evt, collection): void {
    this.collection = collection;
    this._chatService.selectedChannel$.next(collection);
    evt.stopPropagation();
  }
}
