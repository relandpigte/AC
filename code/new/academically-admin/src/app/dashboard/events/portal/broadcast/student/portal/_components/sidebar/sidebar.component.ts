import { ChangeDetectorRef, Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceFeatureFlagMapping } from '@shared/app-component-portal-base';
import { EventUserType, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { Observable, Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';
import { PortalHandoutService } from '../handouts/_services/portal-handout.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { ServiceHandoutsStateService } from '@shared/services/service-handouts-state.service';
import { HubService } from '@app/_shared/services/hub.service';
class MenuItem {
  name: string;
  className: string;
  hasBadge: boolean;

  constructor(name: string, className?: string, hasBadge?: boolean) {
    this.name = name;
    this.className = className;
    this.hasBadge = hasBadge;
  }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent extends AppComponentBase implements OnInit, OnDestroy, OnChanges {
  @ViewChildren('menuItem') menuItemsRef: QueryList<ElementRef>;
  @Input() hidden = false;
  @Input() isHost: boolean;

  eventId: string;
  MenuItem = MenuItem;
  menuItems: MenuItem[] = [];
  activeMenuItem: MenuItem;

  menuBadges: { [key: string]: number } = {};
  menuItemToServiceFeatureFlags: ServiceFeatureFlagMapping = {
    'Attendees': {
      [EventUserType.Audience]: ['attendees', 'AttendeesCanViewAudience'],
      [EventUserType.Guest]: ['attendees', 'AttendeesCanViewAudience'],
      [EventUserType.CoHost]: ['attendees', 'AttendeesCanViewAudience', 'AttendeesPromoteAudience', 'AttendeesCanKickAudience', 'AttendeesCanAdmitAudience'],
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
      [EventUserType.Audience]: ['Activities', 'ActivitiesAudienceCanViewResult', 'ActivitiesAudienceCanParticipate'],
      [EventUserType.Guest]: ['Activities', 'ActivitiesAudienceCanViewResult', 'ActivitiesAudienceCanParticipate'],
      [EventUserType.CoHost]: ['Activities', 'ActivitiesCohostCanAdd'],
    },
    'Handouts': {
      [EventUserType.Audience]: ['Handouts', 'HandoutsAudienceCanDownload', 'HandoutsAudienceCanShare'],
      [EventUserType.Guest]: ['Handouts', 'HandoutsAudienceCanDownload', 'HandoutsAudienceCanShare'],
      [EventUserType.CoHost]: ['Handouts', 'HandoutsCohostCanAdd'],
    },
    'Offers': {
      [EventUserType.Audience]: ['Offers', 'OffersAudienceCanPurchase'],
      [EventUserType.Guest]: ['Offers', 'OffersAudienceCanPurchase'],
      [EventUserType.CoHost]: ['Offers', 'OffersCohostCanAdd'],
    },
    'Reviews': {
      [EventUserType.Audience]: ['Reviews'],
      [EventUserType.Guest]: ['Reviews'],
      [EventUserType.CoHost]: ['Reviews'],
    },
  };

  serviceHandoutsStateService: ServiceHandoutsStateService;

  unsubscribe$ = new Subject();

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _portalService: PortalService,
    private _portalHandoutService: PortalHandoutService,
    private _hubService: HubService,
    private _servicesService: ServicesServiceProxy,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
      }
    });
  }

  get handoutsStateId(): string { return 'handouts-event'; }

  async ngOnInit() {
    this.constructMenu();
    this.listenToMenuChanges();

    // handouts
    this.pipeDestroy(this._portalHandoutService.newHandoutsCount$, count => this.menuBadges['Handouts'] = count);
    await this.initHandoutsAppStates();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('isHost' in changes) {
      if (this.isHost) {
        this.menuItems.push(new MenuItem('Separator'));
        this.menuItems.push(new MenuItem('Settings', 'sliders'));
      }
    }
  }

  private async initHandoutsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.handoutsStateId]: {
        update: { referenceId: this.eventId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.handoutsStateId]: {
        type: ServiceHandoutsStateService,
        args: [this.appSession, this._hubService, this._servicesService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.serviceHandoutsStateService = this.pubSubService.getStateService<ServiceHandoutsStateService>(this.handoutsStateId);
    this.serviceHandoutsStateService.handouts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (!event.data) return;
      switch (event.type) {
        case 'shared':
          this._portalHandoutService.newHandout = event.data;
          if (this.activeMenuItem.name !== 'Handouts') {
            this._portalHandoutService.newHandoutsCount = this._portalHandoutService.newHandoutsCountValue + 1;
          }
          break;
        case 'delete':
          if (this.activeMenuItem.name !== 'Handouts') {
            this._portalHandoutService.newHandoutsCount = this._portalHandoutService.newHandoutsCountValue > 0 ? this._portalHandoutService.newHandoutsCountValue - 1 : 0;
          }
          break;
      }
      this._cdr.detectChanges();
    });
  }

  onMenuItemClick(menuItem: MenuItem, e: Event): void {
    e.preventDefault();
    this.activeMenuItem = menuItem;
    this.resetMenuItemBadge(menuItem);
    this._cdr.detectChanges();
  }

  resetMenuItemBadge(menuItem: MenuItem): void {
    switch(menuItem.name) {
      case 'Handouts':
        this.menuBadges['Handouts'] = 0;
        this._portalHandoutService.newHandoutsCount = 0;
        break;
    }
  }

  private constructMenu(): void {
    this.menuItems.push(new MenuItem('Separator'));
    this.menuItems.push(new MenuItem('Overview', 'home'));
    this.menuItems.push(new MenuItem('Attendees', 'users'));
    this.menuItems.push(new MenuItem('Chat', 'chat'));
    this.menuItems.push(new MenuItem('Comments', 'comments'));
    this.menuItems.push(new MenuItem('Questions', 'help'));
    this.menuItems.push(new MenuItem('Activities', 'pie-chart'));
    this.menuItems.push(new MenuItem('Handouts', 'folder', !this.isHost));
    this.menuItems.push(new MenuItem('Offers', 'shopping-bag'));
    this.menuItems.push(new MenuItem('Reviews', 'star'));
    this.activeMenuItem = this.menuItems[1];
  }

  private listenToMenuChanges() {
    this.menuItems.forEach(menuItem => {
      this.isMenuItemEnabled$(menuItem)
        .pipe(takeUntil(this.unsubscribe$))
        .pipe(pairwise())
        .subscribe(([prev, next]) => {
          if (prev !== next && next === false) {
            if (this.activeMenuItem.name !== 'Overview') {
              this.menuItemsRef.find(m => m.nativeElement.id === 'Overview')?.nativeElement?.click();
            }
          }
        });
    });
  }

  isMenuItemEnabled$(menuItem: MenuItem): Observable<boolean> {
    return this._portalService.getSpecificFeatureFlag$(
      this.menuItemToServiceFeatureFlags,
      menuItem.name,
      this.appSession.userId
    );
  }

  getMenuBadgeValue(menuItem: MenuItem): string {
    return this.menuBadges[menuItem.name] > 0 ? this.menuBadges[menuItem.name] > 9 ? '9+' : this.menuBadges[menuItem.name].toString() : null;
  }
}
