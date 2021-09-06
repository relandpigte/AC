import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectsServiceProxy, ProjectDto, ConversationsServiceProxy, ConversationGroupDto, UserDto, ConversationDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { HubService } from '@app/_shared/services/hub.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.less'],
  animations: [appModuleAnimation()],
})
export class ConversationsComponent extends AppComponentBase implements OnInit {
  projectId: string;
  projects: ProjectDto[] = [];
  conversationGroups: ConversationGroupDto[] = [];
  selectedConversationGroup: ConversationGroupDto;
  users: UserDto[] = [];
  otherUsers: UserDto[] = [];
  conversationsHub: any;

  isLoading = false;

  constructor(
    injector: Injector,
    private _projectsService: ProjectsServiceProxy,
    private _conversationsService: ConversationsServiceProxy,
    private _hubService: HubService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initializeConversationsHub();
    this.getProjects();
    this.getConversationGroups();
  }
  onProjectSelect(projectId: string): void {
    this.projectId = projectId;
    this.getConversationGroups();
  }

  onConversationGroupClick(conversationGroup: ConversationGroupDto): void {
    this.selectedConversationGroup = conversationGroup;
  }

  onConversationUpdated(conversation: ConversationDto): void {
    this.selectedConversationGroup.lastConversationCreationTime = conversation.creationTime;
    this.selectedConversationGroup.lastConversationCreatorUserId = conversation.creatorUserId;
    this.selectedConversationGroup.lastConversationMessage = conversation.message;
  }

  private initializeConversationsHub(): void {
    this._hubService.getConversationsHub().then(hub => {
      this.conversationsHub = hub;
    });
  }

  private getProjects(): void {
    this._projectsService.getForUser()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(projects => {
        this.projects = projects;
      });
  }

  private getConversationGroups(): void {
    this.isLoading = true;
    this._conversationsService.getGroups(this.projectId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(conversationGroups => {
        this.conversationGroups = conversationGroups;
        _.forEach(this.conversationGroups, conversationGroup => {
          if (this.isTutor) {
            this.users[conversationGroup.id] = conversationGroup.project.offers.find(e => e.isAccepted).creatorUser;
            this.otherUsers[conversationGroup.id] = conversationGroup.project.creatorUser;
          } else {
            this.users[conversationGroup.id] = conversationGroup.project.creatorUser;
            this.otherUsers[conversationGroup.id] = conversationGroup.project.offers.find(e => e.isAccepted).creatorUser;
          }
        });
      });
  }
}
