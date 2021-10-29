import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Injector, Input, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { ConversationDto, UserDto, ConversationsServiceProxy, FileParameter, DocumentDto, DocumentsServiceProxy, ConversationDocumentDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { QuillModules } from 'ngx-quill';
import { Observable, ReplaySubject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

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

  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  @ViewChild('dropzone') dropzone : any

  conversations: ConversationDto[] = [];
  conversationFilesLoader: boolean[] = [];
  allowedExtensions = fileUploadConfiguration.allowedFileExtensions;
  conversationMessage = '';
  isConversationsLoading = true;
  isAttaching = false;
  documents: FileParameter[] = [];

  quillModules: QuillModules = {
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
    private _documentsService: DocumentsServiceProxy,
    private render: Renderer2
  ) {
    super(injector);
  }

  async ngOnInit(): Promise<void> {
    this.conversationsHub.on('conversationSent', async (conversation: ConversationDto) => {
      console.log('conversationSent');
      if (conversation.hasFiles) {
        this.conversationFilesLoader[conversation.id] = true;
      }
      this.conversations.push(conversation);
      this.conversations = _.clone(this.conversations);
      if (this.documents && this.documents.length) {
        const sentDocuments = await this._conversationsService.uploadDocuments(conversation.id, this.documents).toPromise();
        this.isAttaching = false;
        if (this.documentUploaderComponent) {
          this.documentUploaderComponent.files = [];
        }
        this.documents = [];

        this.conversationsHub.invoke('sendConversationFiles', [this.otherUser.id, this.user.id], conversation.id, sentDocuments);
        console.log('invoke - sendConversationFiles');
        this.conversationMessage = '';
      }
      this.conversationUpdated.emit(conversation);
    });

    this.conversationsHub.on('conversationFilesSent', async (conversationId: string, documents: ConversationDocumentDto[]) => {
      console.log('conversationFilesSent');
      this.conversationFilesLoader[conversationId] = false;
      this.conversations.find(e => e.id === conversationId).conversationDocuments = documents;
      this.conversations = _.clone(this.conversations);
    });

    this.conversations = await this._conversationsService.getAll(this.projectId).toPromise();
    this.isConversationsLoading = false;
  }

  onMessageFormSubmit(): void {
    if (this.conversationMessage || (this.isAttaching && this.documentUploaderComponent.files.length)) {
      const conversation = new ConversationDto();
      conversation.message = this.conversationMessage;
      conversation.creatorUserId = this.user.id;
      conversation.conversationGroupId = this.conversationGroupId;
      conversation.creatorUser = this.user;

      if (this.isAttaching && this.documentUploaderComponent.files.length) {
        conversation.hasFiles = true;
        this.documents = this.documentUploaderComponent.files.map(file => {
          const fileParameter: FileParameter = {
            fileName: file.name,
            data: file,
          };
          return fileParameter;
        });
        this.isAttaching = false;
      }

      this.conversationsHub.invoke('sendConversation', [this.otherUser.id, this.user.id], conversation);
      console.log('invoke - sendConversation');
      this.conversationMessage = '';
    }
  }

  onAttachClick(): void {
    if (this.isAttaching) {
      this.documentUploaderComponent.files = [];
    }
    this.isAttaching = !this.isAttaching;
  }

  onViewDocumentClick(document: DocumentDto): void {
    this._documentsService.getSecuredUrl(document.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(url => {
        window.open(url, '_blank');
      });
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onSelect(event) {
    this.render.setStyle(this.dropzone.nativeElement, 'display','none');
    this.convertFileTobase64(event.addedFiles[0]).subscribe(base64 => {
      this.conversationMessage = `<p><img src=\"data:image/jpeg;base64,${ base64 }\"></p>`
      this.onMessageFormSubmit()
    });
  }

  onDragEnter(event) {
    this.render.removeStyle(this.dropzone.nativeElement, 'display');
    event.preventDefault();
  }

  private convertFileTobase64(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }
}
