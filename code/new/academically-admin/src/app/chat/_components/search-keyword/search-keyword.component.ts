import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { ChannelDto, ChannelMemberDto, ChatsServiceProxy, MatchedChannelDto, SearchByKeywordResponseDto, UserDto } from '@shared/service-proxies/service-proxies';
import { ChatService } from '@shared/services/chat.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { filter, finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-search-keyword',
    templateUrl: './search-keyword.component.html',
    styleUrls: ['./search-keyword.component.less']
})
export class SearchKeywordComponent extends AppComponentBase implements OnInit {

    @Output() onSelectUser: EventEmitter<UserDto> = new EventEmitter<UserDto>();
    @Output() onSelectChannel: EventEmitter<MatchedChannelDto> = new EventEmitter<MatchedChannelDto>();

    isLoadingList$ = new BehaviorSubject<boolean>(true);

    searchResults: SearchByKeywordResponseDto;
    selectedMatchedChannel: MatchedChannelDto;

    constructor(
        injector: Injector,
        private _chatService: ChatService,
        private _chatsService: ChatsServiceProxy,
    ) {
        super(injector);
    }

    get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
    get loadingSources$() { return [ this.isLoadingList$ ]; }

    get matchedUsers() { return this.searchResults?.users ?? []; }
    get matchedChannels() { return  this.searchResults?.channels ?? []; }

    ngOnInit(): void {
        this._chatService.searchKeyword$
            .pipe(takeUntil(this.destroyed$))
            .pipe(filter(keyword => !!keyword))
            .subscribe(keyword => this.handleOnSearchKeyword(keyword));

        this._chatService.selectedMatchedChannel$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(channel => this.selectedMatchedChannel = channel);
    }

    getChannelRecipient(matched: MatchedChannelDto): ChannelMemberDto {
        return matched?.channel?.members?.find(m => m.userId !== this.appSession.userId);
    }

    getChannelRecipientUser(matched: MatchedChannelDto): UserDto {
        return this.getChannelRecipient(matched)?.user;
    }

    getChannelName(matched: MatchedChannelDto): string {
        const user = this.getChannelRecipientUser(matched);
        return user?.fullName ?? '';
    }

    handleOnSearchKeyword(keyword: string): void {
        this.isLoadingList$.next(true);
        this._chatsService.searchByKeyword(keyword)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingList$.next(false)))
            .subscribe(result => this.searchResults = result);
    }

    handleOnSelectUser(user: UserDto): void {
        this.onSelectUser.next(user);
    }

    handleOnSelectChannel(channel: MatchedChannelDto): void {
        this.onSelectChannel.next(channel);
    }
}
