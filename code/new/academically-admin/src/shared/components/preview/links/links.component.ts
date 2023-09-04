import { ChangeDetectorRef, Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServicesType } from '@shared/service-proxies/service-proxies';
import { LinkPreviewResponse } from '@shared/services/link-preview.service';

@Component({
  selector: 'app-preview-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class PreviewLinksComponent extends AppComponentBase implements OnInit, OnChanges {
  @ViewChild('videoFile') videoFile: ElementRef;

  @Input() linkPreview: LinkPreviewResponse;
  @Input() canRemove: boolean = true;
  @Input() canPlay: boolean = false;

  isRemoved = false;
  isVideoPlaying = false;

  ServicesType = ServicesType;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  get serviceType(): ServicesType { return this.linkPreview?.type; }
  get isSquareImg(): boolean { return this.serviceType === ServicesType.Event; }
  get isCircleImg(): boolean { return this.serviceType === ServicesType.Coaching; }
  get isRectangleImg(): boolean { return !this.isSquareImg && !this.isCircleImg; }

  get isImgShown(): boolean { return this.serviceType !== ServicesType.Article && this.serviceType !== ServicesType.Tutorial; }
  get isVideoShown(): boolean { return this.serviceType !== ServicesType.Article && this.serviceType === ServicesType.Tutorial; }
  get isDescriptionShown(): boolean { return this.serviceType === ServicesType.Article; }
  get isScheduleShown(): boolean { return this.serviceType === ServicesType.Event; }
  get isAuthorShown(): boolean { return this.serviceType === ServicesType.Coaching; }
  get isCompositionsShown(): boolean { return this.serviceType === ServicesType.Course || this.serviceType === ServicesType.Tutorial; }
  get isLinksShown(): boolean { return !this.serviceType; }

  get img(): string { return this.linkPreview?.image ?? 'https://marketplace.canva.com/EAEqfS4X0Xw/1/0/1600w/canva-most-attractive-youtube-thumbnail-wK95f3XNRaM.jpg'; }
  get video(): string { return 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; }
  get schedule(): string { return 'FRI, 23 AUG 2022 AT 18:00'; }
  get title(): string { return this.linkPreview?.title ?? 'Search the world\'s information, including webpages, images, videos and more. Google has many special features to help you find exactly what you\'re looking for.'; }
  get description(): string { return this.linkPreview?.description ?? 'Lorem ipsum dolor sit amet, consectetur ipsumn sit amet, consectetur'; }
  get author(): string { return 'Jingying Chai'; }
  get composition(): string { return '3 modules · 5 lessons'; }
  get link(): string { return this.linkPreview?.url ?? 'https://www.websitename.com/link'; }

  ngOnInit(): void {

  }

  async ngOnChanges(changes: SimpleChanges) {}

  removePreview(): void {
    this.isRemoved = true;
  }

  togglePlayVideo(evt): void {
    evt.preventDefault();
    evt.stopPropagation();

    if (!this.canPlay) return;

    if (this.isVideoPlaying) this.videoFile.nativeElement.pause();
    else this.videoFile.nativeElement.play();

    this.isVideoPlaying = !this.isVideoPlaying;
    this._cdr.detectChanges();
  }
}
