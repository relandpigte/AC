import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardType } from '@shared/models/service-card.model';
import {
  ArticleDto, ArticleStatus,
  ArticleType,
  CoachingDto,
  CourseDto,
  EventCategory,
  EventDto,
  UserDto,
  VideoDto
} from '@shared/service-proxies/service-proxies';
import { ServiceCardDashboard } from '@shared/models/service-card-dashboard.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-service-card-dashboard',
  templateUrl: './service-card-dashboard.component.html',
  styleUrls: ['./service-card-dashboard.component.less']
})
export class ServiceCardDashboardComponent extends AppComponentBase implements OnInit {
  @Input() data: any;
  @Input() isLoading: boolean;
  @Input() isCreator: boolean;
  @Input() isArchive: boolean;

  @Output() onDelete: Subject<string> = new Subject<string>();

  sanitized: ServiceCardDashboard;

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get id(): string { return this.data.id; }
  get cardType(): ServiceCardType { return this.sanitized.type; }
  get name(): string { return this.sanitized.name; }
  get description(): string { return this.sanitized.description; }
  get articleType(): number { return this.data.type; }
  get avatar(): string { return `https://i.pravatar.cc/100?u=${this.id}`; }

  ngOnInit(): void {
    this.sanitizedData();
    console.log(this.data);
  }

  handleDelete(id: string): void {
    this.onDelete.next(id);
  }

  private sanitizedData(): void {
    this.sanitized = <ServiceCardDashboard>{};

    this.sanitized.type = this.getCardType();
    this.sanitized.name = this.data.name;
    this.sanitized.description = this.data.description;
  }

  private getCardType(): ServiceCardType {
    switch (this.data.constructor) {
      case EventDto: {
        const { category } = this.data as EventDto;
        if (category === EventCategory.Broadcast) {
          return 'broadcast';
        }
        return 'workshop';
      }
      case ArticleDto: return 'article';
      case CoachingDto: return 'coaching';
      case CourseDto: return 'course';
      case VideoDto: return 'tutorial';
      case UserDto: return 'user';
    }
    return null;
  }
}
