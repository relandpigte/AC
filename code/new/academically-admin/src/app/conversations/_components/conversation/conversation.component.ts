import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ConversationDto, UserDto, ConversationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { QuillModules } from 'ngx-quill';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit {
  @Input() projectId: string;
  @Input() conversationGroupId: string;
  @Input() user: UserDto = new UserDto();
  @Input() otherUser: UserDto = new UserDto();
  @Input() conversationsHub: any;
  @Output() conversationUpdated = new EventEmitter<ConversationDto>();

  conversations: ConversationDto[] = [];
  conversationMessage = '';
  isConversationsLoading = true;

  quillModules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
    keyboard: {
      bindings: {
        handleEnter: {
          key: 13,
          handler: () => { },
        },
        'header enter': {
          key: 13,
          handler: () => { },
        },
      },
    },
  };

  constructor(
    injector: Injector,
    private _conversationsService: ConversationsServiceProxy,
  ) {
    super(injector);
  }

  async ngOnInit(): Promise<void> {
    this.conversationsHub.on('conversationSent', async (conversation: ConversationDto) => {
      console.log('conversationSent');
      if (conversation.creatorUserId !== this.user.id) {
        this.conversations.push(conversation);
        this.conversations = _.clone(this.conversations);
      }
      console.log(conversation);
      this.conversationUpdated.emit(conversation);
    });

    this.conversations = await this._conversationsService.getAll(this.projectId).toPromise();
    this.isConversationsLoading = false;
  }

  onMessageFormSubmit(): void {
    if (this.conversationMessage.trim()) {
      const conversation = new ConversationDto();
      conversation.message = this.conversationMessage;
      conversation.creatorUserId = this.user.id;
      conversation.conversationGroupId = this.conversationGroupId;
      conversation.creatorUser = this.user;
      console.log(this.user);
      this.conversations.push(conversation);
      this.conversations = _.clone(this.conversations);
      this.conversationsHub.invoke('sendConversation', [this.otherUser.id, this.user.id], conversation);
      this.conversationMessage = '';
    }
  }
}
