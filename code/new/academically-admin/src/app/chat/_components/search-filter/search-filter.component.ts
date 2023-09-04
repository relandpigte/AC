import { Component, OnInit, Output } from '@angular/core';
import { ChatService } from '@shared/services/chat.service';
import { Subject } from 'rxjs';
import { ViewChild } from '@node_modules/@angular/core';
import { SearchUsersComponent } from '@app/chat/_components/search-users/search-users.component';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.less']
})
export class SearchFilterComponent implements OnInit {

  collection = 0;
  @Output() onComposeMessage: Subject<any> = new Subject<any>();
  @ViewChild(SearchUsersComponent) searchUsersComponent: SearchUsersComponent;

  constructor(
    private _chatService: ChatService
  ) {
    this._chatService.selectedChannelType$
      .subscribe(collection => this.collection = collection);
  }

  ngOnInit(): void {
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
