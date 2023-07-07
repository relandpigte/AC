import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { PostDto, PostsServiceProxy, PostTopicDto, PostType, TopicDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-history',
  styleUrls: ['./edit-history.component.scss'],
  templateUrl: 'edit-history.component.html'
})
export class EditHistoryComponent extends AppComponentBase implements OnInit {
  post: PostDto;
  histories: PostDto[] = [];
  isLoading: boolean;

  private id: string;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);
    this._route.paramMap.subscribe(async paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  get postType(): string {
    const type: string[] = ['post', 'question', 'discussion'];
    return type[this.post?.type];
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    try {
      await this.initPost();
      this.buildPostHistory();
    } catch (e) {
      console.log(`Service is not available: ${e}`);
    }

    this.isLoading = false;
  }

  private async initPost() {
    this.post = await this._postsService.get(this.id, true, true).toPromise();
  }

  private buildPostHistory(): void {
    const { title, content, postTopics } = this.post;
    let tempTitle = title;
    let tempContent = content;
    let tempPostTopics = postTopics;

    this.post?.postEditHistories?.map((h, i, arr) => {

      const history = new PostDto(this.post);
      history.title = h.title ?? tempTitle;
      history.content = h.content ?? tempContent;
      history.creationTime = h.changeTime;
      history.postTopics = h.postTopics?.map(t => {
        var postTopicDto = new PostTopicDto();
        postTopicDto.disciplineTaxonomy = t;
        postTopicDto.disciplineTaxonomyId = t.id;
        return postTopicDto;
      }) ?? tempPostTopics;
      this.histories.push(history);

      tempTitle = history.title;
      tempContent = history.content;
      tempPostTopics = history.postTopics;
    });
  }
}
