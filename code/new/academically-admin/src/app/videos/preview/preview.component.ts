import { Component, OnInit, Injector, Input, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, VideoType, GetStudentVideoDto, StudentVideosServiceProxy, PricingType, ServicesServiceProxy, ServiceReviewDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PreviewService } from './_services/preview.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import { ServiceDataService } from '@shared/services/service-data.service';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
  animations: [appModuleAnimation()],
})
export class PreviewComponent extends AppComponentBase implements OnInit {
  @ViewChild('videoEl') videoEl: ElementRef;
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;

  thumbnailUrl: string;

  model = new VideoDto();
  VideoType = VideoType;
  isSidebarHidden = false;
  isPreview = false;
  studentVideo = new GetStudentVideoDto();
  ownReview: ServiceReviewDto;

  private _id: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _router: Router,
    private _modalService: BsModalService,
    private _location: Location,
    private _uploadService: UploadService,
    private _videosService: VideosServiceProxy,
    private _previewService: PreviewService,
    private _studentVideosService: StudentVideosServiceProxy,
    private _servicesService: ServicesServiceProxy,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.isPreview = true;
        this.id = paramMap.get('id');
      }
    });
    this._previewService.studentVideo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.studentVideo = response;
        }
      });
  }

  @Input() set id(value: string) {
    this._id = value;
    this._previewService.preview = this.isPreview;
    this.getVideo();
  }

  @Input() set tab(tab: string) {
    if (tab) {
      setTimeout(() => {
        this.sidebar.setMenuItemClick(tab);
      });
    }
  }

  get shouldShowVideo(): boolean {
    return this.isPreview || this.model.pricingType === PricingType.Free || (!this.isPreview && !_.isEmpty(this.studentVideo));
  }

  ngOnInit(): void {
  }

  onExitClick(): void {
    if (this.isPreview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/home/videos']);
    }
  }

  private getVideo(): void {
    forkJoin([
      this._videosService.get(this._id),
      this._servicesService.getUserReview(this._id),
      this._servicesService.getServiceReviewStats(this._id),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([video, review, reviewStats]) => {
        this.model = video;
        this.ownReview = review;

        this._previewService.video = video;
        this._serviceData.serviceReview = review;
        this._serviceData.serviceReviewStats = reviewStats;
        this.thumbnailUrl = this._uploadService.getFileUrl(video.thumbnailDocument);
        if (!this.isPreview) {
          this.getStudentVideo();
        }
        setTimeout(() => {
          const video = (this.videoEl.nativeElement as HTMLVideoElement);
          video.src = this._uploadService.getFileUrl(this.model.document);
          video.load();
          video.play();
        });
      });
  }

  private getStudentVideo(): void {
    this._studentVideosService.getByVideo(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentVideo = response;
      });
  }

  onMarkAsComplete(): void {
    if (!this.ownReview?.creationTime) this.onReview(this.model);
  }

  onReview(data: any): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = {
      data,
      placeholder: this.l('Reviews.ShareYourThoughts', [this.model.name])
    };
    const modal = this._modalService.show(LeaveReviewComponent, modalSettings);

    modal.content.onCloseModal.subscribe((): void => {
      this._modalService.hide();
    });

    modal.content.onReviewSuccess.subscribe((): void => {
      setTimeout((): void => {
        const modalConfirmationSettings = this.defaultModalSettings as ModalOptions<LeaveReviewConfirmationComponent>;
        modalConfirmationSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
        modalConfirmationSettings.initialState = {
          title: this.l('Reviews.Submitted.Title'),
          subTitle: this.l('Reviews.Submitted.Body', ['tutor']),
          hasGoToReviews: false,
        };
        const modal = this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
        modal.content.onDone.subscribe((): void => {
          this.sidebar.setMenuItemClick('reviews');
        });
      }, 200);
    });
  }

}
