import { Injectable } from '@angular/core';

export enum DashboardServiceView {
  creator = 'creator',
  learner = 'learner'
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private userView: DashboardServiceView;

  setUserView(view: DashboardServiceView): void {
    this.userView = view;
  }

  getUserView(): DashboardServiceView {
    return this.userView;
  }

  switchButtonText(): string {
    return this.userView === DashboardServiceView.learner ? DashboardServiceView.creator : DashboardServiceView.learner;
  }

  handleSwitchView(): void {
    this.userView =
      this.userView === DashboardServiceView.learner ? DashboardServiceView.creator : DashboardServiceView.learner;
  }
}
