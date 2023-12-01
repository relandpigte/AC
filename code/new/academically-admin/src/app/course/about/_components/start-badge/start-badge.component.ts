import { Component, Injector, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-start-badge',
  templateUrl: './start-badge.component.html',
  styleUrls: ['./start-badge.component.less']
})
export class StartBadgeComponent extends AppComponentBase {
  @Input() data: CourseDto;
  @Output() onReview = new Subject<any>();

  constructor(
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  get serviceId(): string { return this.data?.id; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get serviceThumbnail(): string { return this.data?.courseImageUrl || 'assets/img/cover-photos/cp-1.jpeg'; }
  get progress(): number { return this.data?.progress; }
  get isCompleted(): boolean { return this.data?.progress === 100; }
  get isPurchased(): boolean { return this.data?.isPurchased; }

  get startButton(): string {
    switch (this.progress) {
      case 0:
        return this.l('Start');
      case 100:
        return this.l('LeaveReview');
      default:
        return this.l('Continue');
    }
  }

  get currentLesson(): string {
    const course = this.data?.studentCourses?.find(x => x.creatorUserId === this.currentUserId);
    let inProgress = course?.studentCourseSections?.find(x => x.status === 1);
    if (inProgress === undefined) {
      inProgress = course?.studentCourseSections[0];
    }
    return inProgress?.courseSection?.name;
  }

  async handleStartCourse(): Promise<void> {
    if (this.isCompleted) {
      this.onReview.next(this.data);
    } else {
      await this._router.navigate(['/app/student-portal', this.serviceId, 'learn']);
    }
  }
}
