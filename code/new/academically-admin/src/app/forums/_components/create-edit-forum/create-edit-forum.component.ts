import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { CreateForumDto, ForumsServiceProxy, TopicsServiceProxy, TopicDto, CreateForumTopicDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil, finalize, switchMap, map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-edit-forum',
  templateUrl: './create-edit-forum.component.html',
  styleUrls: ['./create-edit-forum.component.less']
})
export class CreateEditForumComponent extends AppComponentBase implements OnInit {
  @Output() modelSaved = new EventEmitter();

  model = new CreateForumDto();
  isLoading = false;
  topics$: Observable<TopicDto[]>;
  topicName = '';

  constructor(
    injector: Injector,
    private _forumsService: ForumsServiceProxy,
    private _topicsService: TopicsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTopics();
  }

  onFormSubmit(): void {
    this._forumsService.create(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
          this.topicName = '';
          this.model = new CreateForumDto();
        })
      ).subscribe(() => {
        this.modelSaved.emit(true);
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  onTopicSelect(topic: TopicDto): void {
    if (_.isNil(this.model.topics)) {
      this.model.topics = [];
    }

    if (this.model.topics.findIndex(e => e.topicName.toLowerCase().trim() === topic.name) < 0) {
      const createForumTopicModel = new CreateForumTopicDto();
      createForumTopicModel.topicId = topic.id;
      createForumTopicModel.topicName = topic.name;
      this.model.topics.push(createForumTopicModel);
      this.topicName = '';
    }
  }

  onTopicKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
      setTimeout(() => {
        const topicName = this.topicName.toLowerCase().trim();

        if (topicName) {
          if (_.isNil(this.model.topics)) {
            this.model.topics = [];
          }

          if (this.model.topics.findIndex(e => e.topicName.toLowerCase().trim() === topicName) < 0) {
            const createForumTopicModel = new CreateForumTopicDto();
            createForumTopicModel.topicName = topicName;
            this.model.topics.push(createForumTopicModel);
          }
          this.topicName = '';
        }
      }, 200);
    }
  }

  onRemoveForumTopicClick(forumTopic: CreateForumTopicDto): void {
    const index = this.model.topics.findIndex(e => e === forumTopic);
    if (index > -1) {
      this.model.topics.splice(index, 1);
    }
  }

  private getTopics(): void {
    this.topics$ = new Observable((observer: Observer<string>) => {
      observer.next(this.topicName);
    }).pipe(
      switchMap((query: string) => {
        return this._topicsService.getAll(query, 0, 10);
      }),
      map(result => result.items),
    );
  }
}
