import { ChangeDetectorRef, Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceFeatureFlagMapping } from '@shared/app-component-portal-base';
import { EventUserType } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';

class MenuItem {
  name: string;
  className: string;

  constructor(name: string, className?: string) {
    this.name = name;
    this.className = className;
  }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() hidden = false;
  @Input() isHost: boolean;

  eventId: string;
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;

  menuItemToServiceFeatureFlags: ServiceFeatureFlagMapping = {
    'Attendees': {
      [EventUserType.Audience]: ['attendees'],
      [EventUserType.Guest]: [''],
      [EventUserType.CoHost]: [''],
    },
    'Chat': {
      [EventUserType.Audience]: ['chat', 'chatAudiencePrivate', 'chatAudiencePublic'],
      [EventUserType.Guest]: ['chat', 'chatAudiencePrivate', 'chatAudiencePublic'],
      [EventUserType.CoHost]: ['chat', 'chatCohostPublic', 'chatCohostPrivate'],
    },
    'Comments': {
      [EventUserType.Audience]: ['comments', 'commentsAudienceCanReact', 'commentsAudienceCanAdd'],
      [EventUserType.Guest]: ['comments', 'commentsAudienceCanReact', 'commentsAudienceCanAdd'],
      [EventUserType.CoHost]: ['comments', 'commentSetting'],
    },
    'Questions': {
      [EventUserType.Audience]: ['questions', 'questionsAudienceCanRespond', 'questionsAudienceCanAsk'],
      [EventUserType.Guest]: ['questions', 'questionsAudienceCanRespond', 'questionsAudienceCanAsk'],
      [EventUserType.CoHost]: ['questions', 'questionsCohostCanAnswerLive', 'questionsCohostCanRespond'],
    },
    'Activities': {
      [EventUserType.Audience]: [''],
      [EventUserType.Guest]: [''],
      [EventUserType.CoHost]: [''],
    },
    'Handouts': {
      [EventUserType.Audience]: [''],
      [EventUserType.Guest]: [''],
      [EventUserType.CoHost]: [''],
    },
    'Offers': {
      [EventUserType.Audience]: [''],
      [EventUserType.Guest]: [''],
      [EventUserType.CoHost]: [''],
    },
    'Reviews': {
      [EventUserType.Audience]: [''],
      [EventUserType.Guest]: [''],
      [EventUserType.CoHost]: [''],
    },
  };

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _portalService: PortalService,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
      }
    });
  }

  ngOnInit(): void {
    this.constructMenu();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('isHost' in changes) {
      if (this.isHost) {
        this.menuItems.push(new MenuItem('Separator'));
        this.menuItems.push(new MenuItem('Settings', 'sliders'));
      }
    }
  }

  onMenuItemClick(menuItem: MenuItem, e: Event): void {
    e.preventDefault();
    this.activeMenuItem = menuItem;
    this._cdr.detectChanges();
  }

  private constructMenu(): void {
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Overview', 'home'));
    this.menuItems.push(new MenuItem('Attendees', 'users'));
    this.menuItems.push(new MenuItem('Chat', 'chat'));
    this.menuItems.push(new MenuItem('Comments', 'comments'));
    this.menuItems.push(new MenuItem('Questions', 'help'));
    this.menuItems.push(new MenuItem('Activities', 'pie-chart'));
    this.menuItems.push(new MenuItem('Handouts', 'folder'));
    this.menuItems.push(new MenuItem('Offers', 'shopping-bag'));
    this.menuItems.push(new MenuItem('Reviews', 'star'));
    this.activeMenuItem = this.menuItems[1];
  }

  isMenuItemEnabled$(menuItem: MenuItem): Observable<boolean> {
    return this._portalService.getSpecificFeatureFlag$(
      this.menuItemToServiceFeatureFlags,
      menuItem.name,
      this.appSession.userId
    );
  }
}
