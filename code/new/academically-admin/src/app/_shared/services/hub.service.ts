import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { Utils } from '@shared/helpers/utils';

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
    return this.getHub('eventSessions', null, callback);
  }

  public getQuestionsHub(callback: (connection?: any) => void): Promise<any> {
    return this.getHub('questions', null, callback);
  }

  public async getUserTopicsHub(): Promise<any> {
    return await this.getHub(`userTopics`);
  }

  public async getServicesHub(): Promise<any> {
    await this.getHub(`services`);
  }

  public async getPostsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`posts`, Utils.generateUrlParams(params));
  }

  public async getCommentsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`comments`, Utils.generateUrlParams(params));
  }

  public async getReactionsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`reactions`, Utils.generateUrlParams(params));
  }

  public getCommentsHubWithParam(referenceId?: string, parentId?: string): Promise<any> {
    let queryParam = null;
    if(referenceId){
      queryParam = "referenceId=" + referenceId;
    }
    if(parentId){
      if(queryParam){
        queryParam = "&parentId=" + parentId;
      }else{
        queryParam = "parentId=" + parentId;
      }
    }
    return this.getHub('comments');
  }


  private getHub(hubName: string, queryParam?: string, callback?: (connection?: any) => void): Promise<any> {
    const promise = new Promise(async (resolve, reject) => {

      let path = abp.appPath + `signalr-${hubName}Hub`;
      if(queryParam){
        path += "?" + queryParam;
      }
      await abp.signalr.startConnection(path, (connection: any) => {
        resolve(connection);
      }).then(connection => {
        if (callback) {
          callback(connection);
        }
      });


      // jQuery.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', async () => {

      // });
    });
    return promise;
  }
}
