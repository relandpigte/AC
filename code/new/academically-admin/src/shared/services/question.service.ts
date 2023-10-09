import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  selectedQuestionType$: BehaviorSubject<number>;

  constructor() {
    this.selectedQuestionType$ = new BehaviorSubject<number>(0);
  }
}
