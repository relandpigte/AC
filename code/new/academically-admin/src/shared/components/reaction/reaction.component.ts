import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ReactionColorClass, ReactionGroup, ReactionIcons, ReactionTypes } from '@shared/enums/post/reaction-group.enum';
import { HubEvent, ReactionDto, ReactionType, ReactionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, of, timer } from 'rxjs';
import { debounce, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-reaction',
    templateUrl: './reaction.component.html',
    styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent extends AppComponentBase implements OnInit {
    @ViewChild('reactionAction') reactionAction: ElementRef<HTMLElement>;
    @ViewChild('popover') popover: ElementRef<HTMLElement>;

    @Input() referenceId: string;
    @Input() reactionGroup: ReactionGroup;

    @Input() parentIcon: string;

    @Input() isActionButton = false;
    @Input() isShowOnlyActiveReactions = false;

    @Input() hasAction = true;
    @Input() hasTally = true;
    @Input() hasReply = true;
    @Input() hasReactionUsersList = false;

    @Input() reactionUsersListPlacement: 'left' | 'right' = 'left';

    @Output() onReaction = new EventEmitter<ReactionType>();
    @Output() onReply = new EventEmitter<void>();
    @Output() onReactionUsers = new EventEmitter<void>();

    actionColorClass = '';
    activeReactionTypes = [];
    totalReactions = 0;

    get ReactionGroup() { return ReactionGroup; }
    get ReactionType() { return ReactionType; }
    get ReactionTypes() { return ReactionTypes[this.reactionGroup] }
    get MyReactionType() { return this.reactions?.find?.(r => r.referenceId === this.referenceId && r.creatorUserId === this.appSession.userId)?.type; }

    reactions: ReactionDto[];
    reactionsCount: { [type in ReactionType]?: number } = {};

    popoverTrigger$ = new BehaviorSubject<{open: boolean, force?: boolean}>(null);
    isReactionUsersListShown = false;

    constructor(
        injector: Injector,
        private _elRef: ElementRef,
        private _renderer: Renderer2,
        private _reactionsService: ReactionsServiceProxy,
        private _hubService: HubService
    ) {
        super(injector);

        this.popoverTrigger$
            .pipe(takeUntil(this.destroyed$))
            .pipe(filter(x => !!x))
            .pipe(distinctUntilChanged())
            .pipe(debounce(t => t.force ? of({}) : timer(500)))
            .subscribe(({open}) => this.handlePopoverTrigger(open));
    }

    ngOnInit() {
        this.reactionsCount = this.ReactionTypes.reduce((counts, curr) => Object.assign(counts, { [curr]: 0 }), {});
        this.getAllReactionCounts();
        this.subscribeToReactions();
    }

    async subscribeToReactions() {
        const hub = await this._hubService.getReactionsHub({ 'referenceId': this.referenceId });
        hub.on(HubEvent[HubEvent.ReactionCreated], () => this.getAllReactionCounts());
        hub.on(HubEvent[HubEvent.ReactionUpdated], () => this.getAllReactionCounts());
        hub.on(HubEvent[HubEvent.ReactionDeleted], () => this.getAllReactionCounts());
    }

    async getAllReactionCounts() {
        this._reactionsService.getAll(this.referenceId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(reactions => {
                this.reactions = reactions;
                this.reactionsCount = reactions.reduce((counts, curr) => Object.assign(counts, { [curr.type]: (counts[curr.type] ?? 0) + 1 }), {});

                this.initActionColorClass();
                this.initActiveReactionTypes();
                this.initTotalReactions();
            });
    }

    @HostListener('document:click', ['$event.target'])
    onFocusOut(element): void {
        if (!this._elRef.nativeElement.contains(element)) {
           this.isReactionUsersListShown = false;
        }
    }

    getReactionCount(type: ReactionType): number { return this.reactionsCount?.[type] ?? 0; }

    getReactionIcon(reactionType: ReactionType) {
        return ReactionIcons[reactionType];
    }

    getReactionColorClass(reactionType: ReactionType) {
        return ReactionColorClass[reactionType];
    }

    onReactClick(reactType: ReactionType): void {
        if (this.popover) this._renderer.addClass(this.popover.nativeElement, 'd-none');
        if (this.onReaction.observers?.length) return this.onReaction.emit(reactType);
        else this.sendMyReaction(reactType);
    }

    onReplyClick(): void {
        this.onReply.emit();
    }

    onReactionUsersClick(): void {
        this.isReactionUsersListShown = !this.isReactionUsersListShown;
    }

    openPopover(open: boolean, force = false): void {
        this.popoverTrigger$.next({open, force});
    }

    handlePopoverTrigger(open: boolean): void {
        if (this.reactionAction) {
            if (open) this._renderer.addClass(this.reactionAction.nativeElement, 'inactive');
            else this._renderer.removeClass(this.reactionAction.nativeElement, 'inactive');
        }

        if (this.popover) {
            if (open) this._renderer.removeClass(this.popover.nativeElement, 'd-none');
            else this._renderer.addClass(this.popover.nativeElement, 'd-none');
        }
    }

    private sendMyReaction(type: ReactionType) {
        this._reactionsService.save(this.referenceId, type).subscribe(() => {});
    }

    toggleMyReaction() {
        const myReactionType = this.MyReactionType;
        const [defaultReactionType] = this.ReactionTypes;
        if (myReactionType) this._reactionsService.save(this.referenceId, myReactionType).subscribe(() => {});
        else this._reactionsService.save(this.referenceId, defaultReactionType).subscribe(() => {});
        this.openPopover(false, true);
    }

    private initActionColorClass(): void {
        const getClass = () => {
            if (this.isActionButton) {
                if (this.reactions?.find?.(r => r.referenceId === this.referenceId && r.creatorUserId === this.appSession.userId)) return 'active';
                else return '';
            }
            return ReactionColorClass[this.MyReactionType];
        };
        this.actionColorClass = getClass();
    }

    private initActiveReactionTypes(): void {
        this.activeReactionTypes = this.ReactionTypes.filter(r => this.reactionsCount[r] > 0);
    }

    private initTotalReactions(): void {
        this.totalReactions = this.reactions?.length ?? 0;
    }
}
