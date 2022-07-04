import { QuestionDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

export interface CustomAction {
  label: string;
  icon?: string;
  class?: string;
  prefix?: (question: QuestionDto) => string;
  action: (question: QuestionDto) => void;
}

export enum QuestionAction {
  Created,
  Replied,
  Upvoted,
  Downvoted,
}

export class QuestionSignalData {
  action: QuestionAction | undefined;
  data: string;

  constructor(action?: QuestionAction, data?: QuestionDto) {
    this.action = action;
    if (data !== undefined) {
      this.data = JSON.stringify(data);
    } else {
      this.data = "";
    }
  }

  public getDataObject(): QuestionDto {
    const parsed = JSON.parse(this.data) as QuestionDto;
    const question = new QuestionDto();
    question.init(parsed);
    return question;
  }
}
