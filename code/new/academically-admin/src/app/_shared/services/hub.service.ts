import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AppConsts } from '@shared/AppConsts';
import { Utils } from '@shared/helpers/utils';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor() { }

  public getCommonHub(): Promise<any> {
    return this.getHub();
  }

  public getSessionsHub(): Promise<any> {
    return this.getHub('sessions');
  }

  public getConversationsHub(): Promise<any> {
    return this.getHub('conversations');
  }

  public getEventSessionsHub(params?: Record<string, any>, callback?: (connection?: any) => void): Promise<any> {
    return this.getHub('eventSessions', Utils.generateUrlParams(params), callback);
  }

  public getEventSettingsHub(params?: Record<string, any>): Promise<any> {
    return this.getHub('eventSettings', Utils.generateUrlParams(params));
  }

  public getQuestionsHub(params?: Record<string, any>): Promise<any> {
    return this.getHub('questions', Utils.generateUrlParams(params));
  }

  public getAnsweringLiveQuestionHub(): Promise<any> {
    return this.getHub('answeringLiveQuestion');
  }

  public async getQuestionsReactionsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`questionsReactions`, Utils.generateUrlParams(params));
  }

  public async getUserTopicsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`userTopics`, Utils.generateUrlParams(params));
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

  public async getChannelsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`channels`, Utils.generateUrlParams(params));
  }

  public async getChannelMessagesHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`channelMessages`, Utils.generateUrlParams(params));
  }

  public async getNewUserStatusLogHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`newUserStatusLog`, Utils.generateUrlParams(params));
  }

  public async getNotificationsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`notifications`, Utils.generateUrlParams(params));
  }

  public async getServiceOffersHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`serviceOffers`, Utils.generateUrlParams(params));
  }

  public async getEventPollsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`eventPolls`, Utils.generateUrlParams(params));
  }

  public async getEventsHub(params?: Record<string, any>): Promise<any> {
    return await this.getHub(`events`, Utils.generateUrlParams(params));
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


  private getHub(hubName?: string, queryParam?: string, callback?: (connection?: any) => void): Promise<HubConnection> {
    const promise = new Promise<HubConnection>(async (resolve, reject) => {
      let path = `${AppConsts.remoteServiceBaseUrl}/signalr${hubName ? `-${hubName}Hub` : ''}`;
      if (queryParam) path += "?" + queryParam;

      const hub = new HubConnectionBuilder()
        .withUrl(path)
        .build();
      hub.serverTimeoutInMilliseconds = 240000;
      resolve(hub);

      if (callback) callback(hub);
    });
    return promise;
  }
}
