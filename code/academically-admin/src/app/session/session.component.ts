import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto, SessionDto, UserProfileDto, UserSessionsServiceProxy, UserTutorialDto } from '@shared/service-proxies/service-proxies';
import { VideoConferenceService } from '@shared/services/video-conference.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.less'],
  animations: [appModuleAnimation()],
})
export class SessionComponent extends AppComponentBase implements OnInit, OnDestroy {
  id: string;
  localCallId = 'agora_local';
  remoteCalls: string[];
  isVideoEnabled = false;
  isMicEnabled = true;
  isRemoteVideEnabled = false;
  session: SessionDto = new SessionDto();
  localParticipant: UserProfileDto;
  remoteParticipant: UserProfileDto;

  constructor(
    injector: Injector,
    private _videoConferenceService: VideoConferenceService,
    private _sessionsService: UserSessionsServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    super(injector);
    this.session.tutorOffer = new GetTutorOfferDto();
    this.session.tutorOffer.tutorial = new UserTutorialDto();
    this._videoConferenceService.initialize(this.appSession.userId, this.localCallId);
    this._videoConferenceService.remoteCallsUpdate.subscribe(remoteCalls => {
      this.remoteCalls = remoteCalls;
    });
    this._videoConferenceService.remoteVideoToggle.subscribe(isEnabled => {
      this.isRemoteVideEnabled = isEnabled;
    });
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.getSession();
    })
  }

  ngOnDestroy(): void {
    this._videoConferenceService.leave();
  }

  onToggleVideo(): void {
    this.isVideoEnabled = !this.isVideoEnabled;
    this._videoConferenceService.toggleVideo(this.isVideoEnabled);
  }

  onToggleMic(): void {
    this.isMicEnabled = !this.isMicEnabled;
    this._videoConferenceService.toggleAudio(this.isMicEnabled);
  }

  onLeaveClick(): void {
    this._videoConferenceService.leave();
    this._router.navigate(['/app/home']);
  }

  private getSession(): void {
    this._sessionsService.join(this.id).subscribe(joinSessionResult => {
      this.session = joinSessionResult.session;
      if (joinSessionResult.session.tutorOffer.tutor.userId === this.appSession.userId) {
        this.localParticipant = joinSessionResult.session.tutorOffer.tutor;
        this.remoteParticipant = joinSessionResult.session.tutorOffer.tutorial.student;
      } else {
        this.localParticipant = joinSessionResult.session.tutorOffer.tutorial.student;
        this.remoteParticipant = joinSessionResult.session.tutorOffer.tutor;
      }
      this._videoConferenceService.join(joinSessionResult.channelName, joinSessionResult.channelToken);
    });
  }
}
