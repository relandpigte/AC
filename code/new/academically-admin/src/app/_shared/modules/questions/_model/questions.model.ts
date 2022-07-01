import { QuestionDto } from '@shared/service-proxies/service-proxies';

export interface CustomAction {
  label: string;
  class?: string;
  action: (question: QuestionDto) => void;
}

export enum QuestionAction {
  Created,
  Replied,
  Upvoted,
  Downvoted,
}

export class QuestionSignalData<TObject> {
  action: QuestionAction | undefined;
  data: string;

  constructor(action?: QuestionAction, data?: TObject) {
    this.action = action;
    if (data !== undefined) {
      this.data = JSON.stringify(data);
    } else {
      this.data = "";
    }
  }

  public getDataObject<TObject>(): TObject {
    return JSON.parse(this.data) as TObject;
  }
}
