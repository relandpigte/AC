import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor() { }

  public getSessionsHub(): Promise<any> {
    return this.getHub('sessions');
  }

  public getConversationsHub(): Promise<any> {
    return this.getHub('conversations');
  }

  public getEventSessionsHub(callback: (connection?: any) => void): Promise<any> {
    return this.getHub('eventSessions', callback);
  }

  public getQuestionsHub(callback: (connection?: any) => void): Promise<any> {
    return this.getHub('questions', callback);
  }

  private getHub(hubName: string, callback?: (connection?: any) => void): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      jQuery.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', async () => {
        await abp.signalr.startConnection(abp.appPath + `signalr-${hubName}Hub`, (connection: any) => {
          resolve(connection);
        }).then(connection => {
          if (callback) {
            callback(connection);
          }
        });
      });
    });
    return promise;
  }
}
