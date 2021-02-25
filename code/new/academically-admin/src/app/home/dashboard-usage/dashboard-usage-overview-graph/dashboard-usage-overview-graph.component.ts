import { Component, OnInit } from '@angular/core';

enum SessionTypes {
  live,
  offline,
}

@Component({
  selector: 'app-dashboard-usage-overview-graph',
  templateUrl: './dashboard-usage-overview-graph.component.html',
  styleUrls: ['./dashboard-usage-overview-graph.component.less']
})
export class DashboardUsageOverviewGraphComponent implements OnInit {
  SessionTypes = SessionTypes;
  sessionsBarChart: any = {
    type: "bar",
    options: {
      scales: {
        yAxes: [
          {
            id: "liveSessions",
            type: "linear",
            display: "auto",
            ticks: {
              callback: function (e: any) {
                return e + " hrs"
              },
            },
          },
          {
            id: "offlineSessions",
            type: "linear",
            display: "auto",
            ticks: {
              callback: function (e: any) {
                return e + " hrs"
              },
            },
          },
        ],
      },
    },
    data: {
      labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
    },
  };
  currentSessionType = SessionTypes.live;
  currentDataset: any[];

  constructor() {
    this.currentDataset = this.getLiveSessionsDataset();
  }

  ngOnInit(): void {
  }

  onLiveSessionsClick(): void {
    this.currentSessionType = SessionTypes.live;
    this.currentDataset = this.getLiveSessionsDataset();
  }

  onOfflineSessionsClick(): void {
    this.currentSessionType = SessionTypes.offline;
    this.currentDataset = this.getOfflineSessionsDataset();
  }

  private getLiveSessionsDataset(): any[] {
    return [
      {
        label: "Live Sessions",
        data: [15, 2, 20, 2, 2, 2, 18, 10, 5, 15, 10, 20],
        yAxisID: "liveSessions",
        barThickness: 20,
        maxBarThickness: 100,
      },
    ];
  }

  private getOfflineSessionsDataset(): any[] {
    return [
      {
        label: "Offline Sessions",
        data: [6, 5, 2, 8, 8, 4, 5, 7, 3, 2, 5, 1],
        yAxisID: "offlineSessions",
        barThickness: 20,
        maxBarThickness: 100,
      },
    ];
  }
}
