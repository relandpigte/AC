import { Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { PostTabs } from '@shared/modals/upsert-post/upsert-post.component';
import { DisciplineTaxonomiesServiceProxy, KeywordSearchStrategy, PostType } from '@shared/service-proxies/service-proxies';
import { PostFocusField } from '@shared/enums/post/post-focus-field.enum';
import { Subject } from 'rxjs';

export interface VisibilityOptions {
  label: string;
  value: any;
}

@Component({
  selector: 'app-community-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class CommunityPostComponent extends AppComponentBase implements OnInit, OnChanges {
  @ViewChild('titleEl') titleEl: ElementRef<HTMLElement>;
  @ViewChild('informationEl') informationEl: ElementRef<HTMLElement>;
  @ViewChild('topicEl') topicInput: ElementRef<HTMLElement>;

  @Input() type: PostTabs;
  @Output() onModelChange = new EventEmitter<any>();
  @Output() onFocusChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCaretPos: EventEmitter<number> = new EventEmitter<number>();
  @Input() title: string;
  @Input() information: string;
  @Input() model: any = {};

  visibility: VisibilityOptions;
  visibilityOptions: VisibilityOptions[] = [];
  topicsChoices: any[] = [];
  selectedTopics: { id: string, name: string }[] = [];
  newSelectedTopics: { id: string, name: string }[] = [];
  isLoadingTopics = false;

  triggerTextAreaResize$ = new Subject<HTMLTextAreaElement>();

  constructor(
    injector: Injector,
    private _renderer: Renderer2,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
  }

  get authorName(): string { return ([this.appSession.user.name, this.appSession.user.surname]).filter(n => n).join(' '); }
  get isTopicsOptional(): boolean { return this.type === PostTabs.QuickPost; }
  get focusField() { return PostFocusField; }

  ngOnInit(): void {
    this.initVisibilityOptions();
    this.model = this.model ? this.model : {};

    if (this.model.id != null) {
      this.updateFields();
    } else {
      this.updateModel();
    }

    this.triggerTextAreaResize$
      .pipe(debounceTime(10))
      .subscribe((el: HTMLTextAreaElement) => {
        this._renderer.setStyle(el, 'height', `0px`);
        this._renderer.setStyle(el, 'height', `${el.scrollHeight}px`);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('type' in changes && changes.type?.previousValue !== changes.type?.currentValue) {
      this.setFocus();
    }
  }

  updateFocusedField(field: PostFocusField): void {
    this.onFocusChange.emit(field);
  }

  updateCaretPos(el: HTMLTextAreaElement | HTMLInputElement): void {
    this.onCaretPos.emit(el.selectionStart);
  }

  updateTextAreaHeight(el: HTMLTextAreaElement) {
    this.triggerTextAreaResize$.next(el);
  }

  updateFields(): void {
    this.title = this.model.title
    this.information = this.model.content;
    this.visibility.value = this.model.visibility;
    this.selectedTopics = this.model.postTopics.map(e => { return { id: e.disciplineTaxonomy.id, name: e.disciplineTaxonomy.name }});
  }

  updateModel(): void {
    this.model.title = this.title;
    this.model.information = this.information;
    this.model.visibility = this.visibility.value;
    this.model.type = this.getPostType();
    this.model.topics = this.selectedTopics.filter(t => t.id).map(t => t.id) ?? [];
    this.model.newTopics = this.newSelectedTopics.map(t => t.name);
    this.onModelChange.emit(this.model);
  }

  handleTopicsModelUpdate(data: any): void {
    const { selected, newSelected } = data;
    this.selectedTopics = selected;
    this.newSelectedTopics = newSelected;
    this.updateModel();
  }

  handleTopicsKeywordUpdate(data: any): void {
    const { keyword, showLoading } = data;
    this.isLoadingTopics = showLoading;
    this._taxonomyService.getAllLastChildren(keyword, KeywordSearchStrategy.StartsWith, true, TopicSorting.Popular, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingTopics = false))
      .subscribe(topics => this.topicsChoices = topics.filter(t => !this.selectedTopics.some(x => x.id === t.id)));
  }

  private initVisibilityOptions(): void {
    this.visibilityOptions = [
      { label: 'to everyone', value: null }
    ];
    this.visibility = this.visibilityOptions[0];
  }

  private getPostType(): PostType {
    switch(this.type) {
      case PostTabs.QuickPost:
        return PostType.QuickPost;
      case PostTabs.AddQuestion:
        return PostType.Question;
      default:
        return PostType.Discussion;
    }
  }

  private setFocus(): void {
    setTimeout(() => {
      if (this.titleEl) this.titleEl.nativeElement.focus();
      else if (this.informationEl) this.informationEl.nativeElement.focus();
    }, 10);
  }
}
