import { Injectable, Injector } from '@angular/core';
import { AppSessionService } from '@shared/session/app-session.service';

export enum DashboardServiceView {
  creator = 'creator',
  learner = 'learner'
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  appSession: AppSessionService;
  private currentView = 'currentView';

  constructor(injector: Injector) {
    this.appSession = injector.get(AppSessionService);
    this.initDashboardService();
  }

  setUserView(view: DashboardServiceView): void {
    localStorage.setItem(this.currentView, view);
  }

  getUserView(): string {
    return localStorage.getItem(this.currentView);
  }

  switchButtonText(): string {
    return this.getUserView() === DashboardServiceView.learner ?
      DashboardServiceView.creator :
      DashboardServiceView.learner;
  }

  handleSwitchView(): void {
    this.setUserView(this.getUserView() === DashboardServiceView.learner ?
      DashboardServiceView.creator :
      DashboardServiceView.learner);
  }

  private initDashboardService(): void {
    if (this.checkUserRole('student')) {
      this.setUserView(DashboardServiceView.learner);
    }
  }

  private checkUserRole(role: string): boolean {
    return this.appSession.user.roles.findIndex(e => e.toLowerCase() === role) >= 0;
  }
}
