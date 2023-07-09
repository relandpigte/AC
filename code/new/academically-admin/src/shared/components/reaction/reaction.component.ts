import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReactionColorClass, ReactionGroup, ReactionIcons, ReactionTypes } from '@shared/enums/post/reaction-group.enum';
import { ReactionDto, ReactionType, ReactionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-reaction',
    templateUrl: './reaction.component.html',
    styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent extends AppComponentBase implements OnInit {
    @ViewChild('popover') popover: ElementRef<HTMLElement>;

    @Input() referenceId: string;
    @Input() reactionGroup: ReactionGroup;

    @Output() onReaction = new EventEmitter<ReactionType>();
    @Output() onReply = new EventEmitter<void>();

    get ReactionGroup() { return ReactionGroup; }
    get ReactionTypes() { return ReactionTypes[this.reactionGroup]; }
    get TotalReactions(): number { return this.reactions?.length ?? 0; }

    reactions: ReactionDto[];
    reactionsCount: { [type in ReactionType]?: number } = {};

    popoverTrigger$ = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private _renderer: Renderer2,
        private _reactionsService: ReactionsServiceProxy
    ) {
        super(injector);

        this.popoverTrigger$
            .pipe(takeUntil(this.destroyed$))
            .pipe(distinctUntilChanged())
            .pipe(debounceTime(500))
            .subscribe(open => {
                if (!this.popover) return;
                if (open) this._renderer.removeClass(this.popover.nativeElement, 'd-none');
                else this._renderer.addClass(this.popover.nativeElement, 'd-none');
            });
    }

    ngOnInit() {
        this.reactionsCount = this.ReactionTypes.reduce((counts, curr) => Object.assign(counts, { [curr]: 0 }), {});
        this.getAllReactionCounts();
    }

    async getAllReactionCounts() {
        this._reactionsService.getAll(this.referenceId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(reactions => {
                this.reactions = reactions;
                this.reactionsCount = reactions.reduce((counts, curr) => Object.assign(counts, { [curr.type]: (counts[curr.type] ?? 0) + 1 }), {});
            });
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
        return this.onReaction.emit(reactType);
    }

    onReplyClick(): void {
        this.onReply.emit();
    }

    openPopover(open: boolean): void {
        this.popoverTrigger$.next(open);
    }
}
